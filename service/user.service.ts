import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from './api.service';
import {User} from '../model/user';
import { map } from 'rxjs/operators';


@Injectable()
export class UserService {

    constructor(private api: ApiService) {

    }
    endPoint;

    getUsers(filter?: string): Observable<User[]> {

         this.endPoint = '/users';

        return this.api.get(this.endPoint).pipe(map(res => res.json() as User[]));
    }

    search(q: string): Observable<any> {
        this.endPoint = '/search/users?q=' + q;
        return this.api.get(this.endPoint).pipe(map(res => res.json() as User[]));

    }

    getUserFollowers(user: string): Observable<any> {

        this.endPoint = '/users/' + user + '/followers';
        return this.api.get(this.endPoint).pipe(map(res => res.json() as User[]));
    }

}
