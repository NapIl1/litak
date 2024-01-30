import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { API_URL } from '../consts/consts';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly USERS_API = API_URL + 'Users';

  private readonly USERINFO_KEY = 'USER_INFO';

  constructor(public http: HttpClient) { }

  public async getAllUsers(): Promise<User[]> {
    const users = await lastValueFrom(this.http.get<User[]>(this.USERS_API))
    return users ?? [];
  }

  public async addUser(user: User): Promise<void> {
    try {
      await lastValueFrom(this.http.post<string>(this.USERS_API, user));

    } catch (error) {

    }
  }

  public async removeUser(id: string):Promise<void> {
    try {
      await lastValueFrom(this.http.delete(this.USERS_API + `?userId=${id}`));
    } catch (error) {

    }
  }

  public async updateUser(user: User): Promise<void> {
    const id = user._id;
    delete user._id;
    await lastValueFrom(this.http.put(this.USERS_API + `?userId=${id}`, user));

    user._id = id;

    localStorage.setItem(this.USERINFO_KEY, JSON.stringify(user));

  }

  public async login(username: string, password: string): Promise<User | null> {
    try {
      const user = await lastValueFrom(this.http.get<User>(`${this.USERS_API}/${username}/${password}`))

      localStorage.setItem(this.USERINFO_KEY, JSON.stringify(user));
      return user;

    } catch (error) {
      return null;
    }
  }

  public getUserInfo(): User | null {
    const data = localStorage.getItem(this.USERINFO_KEY);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  }

  public logout(): void {
    localStorage.removeItem(this.USERINFO_KEY);
  }

}
