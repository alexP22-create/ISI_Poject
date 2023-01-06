import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

export interface ITestItem {
    name: string,
    lat: number,
    lng: number
}

export interface User {
    username: string,
    password: string,
    role: string,
}


@Injectable()
export class FirebaseService {

    listFeed: Observable<any[]>;
    objFeed: Observable<any>;

    constructor(public db: AngularFireDatabase) {

    }

    connectToDatabase() {
        this.listFeed = this.db.list('usersList').valueChanges();
        this.objFeed = this.db.object('user').valueChanges();
    }

    getChangeFeedList() {
        return this.listFeed;
    }

    getChangeFeedObj() {
        return this.objFeed;
    }

    addPointItem(lat: number, lng: number) {
        let item: ITestItem = {
            name: "test",
            lat: lat,
            lng: lng
        };
        this.db.list('list').push(item);
    }

    syncPointItem(lat: number, lng: number) {
        let item: ITestItem = {
            name: "test",
            lat: lat,
            lng: lng
        };
        this.db.object('obj').set([item]);
    }

    addUser(username: string, password: string, role: string) {
        let user: User = {
            username: username,
            password: password,
            role: role
        };
        this.db.list('usersList').push(user);
        
    }

    syncUser(username: string, password: string, role: string) {
        let user: User = {
            username: username,
            password: password,
            role: role
        };
        this.db.object('user').set([user]);
    
    }
}