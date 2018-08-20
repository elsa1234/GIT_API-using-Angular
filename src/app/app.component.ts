import { User } from './../../model/user';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { UserService } from './../../service/user.service';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Github API';

  cache = {
    users : [],
    selectedUser : []
  };

  users: User[] = [];
  search: Subject<string> = new Subject <string>();
  selectedUser: User = new User();
  loadingFollowers = false;

  constructor(private userService: UserService) {
    this.search.pipe(debounceTime(200)).subscribe((searchTerm) => {
      // user service and search by uery

      this.userService.search(searchTerm).subscribe(res => {
        this.users = res = res.items as User[];
      });
    });
  }
    ngOnInit() {
      this.userService.getUsers().subscribe(res => {
        this.cache.users = res; // store cache for next time.
        this.users = res;
      }, error => {
        console.log(error);
      });
    }

    // user typing key for search

    onSearch(q: string) {
      if (q !== '') {
        this.search.next(q);
      } else {

        // if empty, restore first search users
        this.users = this.cache.users;
      }
    }

    go(s: string) {
      if (s === 'home') {
        this.selectedUser = new User();
        this.users = this.cache.users;
      }
    }


    viewUser(user: User) {

      this.selectedUser = user;

      const userInCache: User = this.findUserInCache(user);
      // let find if existing in cache we return and no longer call to api again
      if (userInCache) {
          this.selectedUser = userInCache;
      } else {
          // get followers of this user
          this.loadingFollowers = true;

          this.userService.getUserFollowers(user.login).subscribe(res => {
              this.selectedUser.followers = res as User[];

              this.cacheSelectUser(this.selectedUser);

              this.loadingFollowers = false;

          }, err => {
              console.log(err);
              this.loadingFollowers = false;
          });

      }

  }

  /**
   * we storage selected user and dont again to api. just simply function for now.
   * */

  cacheSelectUser(user: User) {
      if (!this.findUserInCache(user)) {
          this.cache.selectedUser.push(user);
      }

  }

  /**
   * Find user if exist in cache we return user object
   * @param user
   * @returns {boolean}
   */
  findUserInCache(user: User): User {

      for (let i = 0; i < this.cache.selectedUser.length; i++) {
          if (this.cache.selectedUser[i].login === user.login) {
              return this.cache.selectedUser[i];
          }
      }

      return null;
  }
}
