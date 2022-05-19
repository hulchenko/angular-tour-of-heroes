import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private messagesService: MessagesService, private http: HttpClient) { }
  private log(message: string) {
    this.messagesService.add(`Hero service: ${message}`);
  }
  private heroesUrl = 'api/heroes';

  getHeroes(): Observable<Hero[]> {
    // const heroes = of(HEROES);
    // this.messagesService.add('Heroes loaded.');
    // return heroes;
    return this.http.get<Hero[]>(this.heroesUrl)
  }

  getHero(id: number): Observable<Hero> {
    const hero = HEROES.find(i => i.id === id)!;
    this.messagesService.add(`HeroService: fetched hero id=${id}`)
    return of(hero);
  }
}
