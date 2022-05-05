import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private messagesService: MessagesService) { }

  getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES);
    this.messagesService.add('Heroes loaded.');
    return heroes;
  }

  getHero(id: number): Observable<Hero> {
    const hero = HEROES.find(i => i.id === id)!;
    this.messagesService.add(`HeroService: fetched hero id=${id}`)
    return of(hero);
  }
}
