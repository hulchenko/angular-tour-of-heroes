import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private messagesService: MessagesService, private http: HttpClient) { }
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
  private log(message: string) {
    this.messagesService.add(`Hero service: ${message}`);
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`ERROR HERE: `, error);
      this.log(`${operation} failed: ${error.message}`)
      return of(result as T)
    }
  }
  private heroesUrl = 'api/heroes';

  getHeroes(): Observable<Hero[]> {
    // BEFORE HTTP:

    // const heroes = of(HEROES);
    // this.messagesService.add('Heroes loaded.');
    // return heroes;

    // AFTER HTTP:
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(_ => this.log('TAP + fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', [])))
  }

  getHero(id: number): Observable<Hero> {
    // BEFORE HTTP:

    // const hero = HEROES.find(i => i.id === id)!;
    // this.messagesService.add(`HeroService: fetched hero id=${id}`)
    // return of(hero);

    // AFTER HTTP:
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(x => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(x => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    )
  }

  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(x => this.log(`removed hero w/ id ${id}`)),
      catchError(this.handleError<Hero>('removeHero'))
    )
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching: ${term}`) :
        this.log(`no heroes matching: ${term}`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    )
  }
}
