import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISimulado, NewSimulado } from '../simulado.model';

export type PartialUpdateSimulado = Partial<ISimulado> & Pick<ISimulado, 'id'>;

export type EntityResponseType = HttpResponse<ISimulado>;
export type EntityArrayResponseType = HttpResponse<ISimulado[]>;

@Injectable({ providedIn: 'root' })
export class SimuladoService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/simulados');

  create(simulado: NewSimulado): Observable<EntityResponseType> {
    return this.http.post<ISimulado>(this.resourceUrl, simulado, { observe: 'response' });
  }

  update(simulado: ISimulado): Observable<EntityResponseType> {
    return this.http.put<ISimulado>(`${this.resourceUrl}/${this.getSimuladoIdentifier(simulado)}`, simulado, { observe: 'response' });
  }

  partialUpdate(simulado: PartialUpdateSimulado): Observable<EntityResponseType> {
    return this.http.patch<ISimulado>(`${this.resourceUrl}/${this.getSimuladoIdentifier(simulado)}`, simulado, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISimulado>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISimulado[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSimuladoIdentifier(simulado: Pick<ISimulado, 'id'>): number {
    return simulado.id;
  }

  compareSimulado(o1: Pick<ISimulado, 'id'> | null, o2: Pick<ISimulado, 'id'> | null): boolean {
    return o1 && o2 ? this.getSimuladoIdentifier(o1) === this.getSimuladoIdentifier(o2) : o1 === o2;
  }

  addSimuladoToCollectionIfMissing<Type extends Pick<ISimulado, 'id'>>(
    simuladoCollection: Type[],
    ...simuladosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const simulados: Type[] = simuladosToCheck.filter(isPresent);
    if (simulados.length > 0) {
      const simuladoCollectionIdentifiers = simuladoCollection.map(simuladoItem => this.getSimuladoIdentifier(simuladoItem));
      const simuladosToAdd = simulados.filter(simuladoItem => {
        const simuladoIdentifier = this.getSimuladoIdentifier(simuladoItem);
        if (simuladoCollectionIdentifiers.includes(simuladoIdentifier)) {
          return false;
        }
        simuladoCollectionIdentifiers.push(simuladoIdentifier);
        return true;
      });
      return [...simuladosToAdd, ...simuladoCollection];
    }
    return simuladoCollection;
  }
}
