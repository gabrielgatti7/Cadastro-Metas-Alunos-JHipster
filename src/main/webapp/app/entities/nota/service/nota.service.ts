import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INota, NewNota } from '../nota.model';

export type PartialUpdateNota = Partial<INota> & Pick<INota, 'id'>;

export type EntityResponseType = HttpResponse<INota>;
export type EntityArrayResponseType = HttpResponse<INota[]>;

@Injectable({ providedIn: 'root' })
export class NotaService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/notas');

  create(nota: NewNota): Observable<EntityResponseType> {
    return this.http.post<INota>(this.resourceUrl, nota, { observe: 'response' });
  }

  update(nota: INota): Observable<EntityResponseType> {
    return this.http.put<INota>(`${this.resourceUrl}/${this.getNotaIdentifier(nota)}`, nota, { observe: 'response' });
  }

  partialUpdate(nota: PartialUpdateNota): Observable<EntityResponseType> {
    return this.http.patch<INota>(`${this.resourceUrl}/${this.getNotaIdentifier(nota)}`, nota, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<INota>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<INota[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getNotaIdentifier(nota: Pick<INota, 'id'>): number {
    return nota.id;
  }

  compareNota(o1: Pick<INota, 'id'> | null, o2: Pick<INota, 'id'> | null): boolean {
    return o1 && o2 ? this.getNotaIdentifier(o1) === this.getNotaIdentifier(o2) : o1 === o2;
  }

  addNotaToCollectionIfMissing<Type extends Pick<INota, 'id'>>(
    notaCollection: Type[],
    ...notasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const notas: Type[] = notasToCheck.filter(isPresent);
    if (notas.length > 0) {
      const notaCollectionIdentifiers = notaCollection.map(notaItem => this.getNotaIdentifier(notaItem));
      const notasToAdd = notas.filter(notaItem => {
        const notaIdentifier = this.getNotaIdentifier(notaItem);
        if (notaCollectionIdentifiers.includes(notaIdentifier)) {
          return false;
        }
        notaCollectionIdentifiers.push(notaIdentifier);
        return true;
      });
      return [...notasToAdd, ...notaCollection];
    }
    return notaCollection;
  }
}
