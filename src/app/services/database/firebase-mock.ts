import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable()
export class FirebaseMockService {


    constructor() {

    }

    connectToDatabase() {

    }

    getChangeFeedList() {
        return new Observable();
    }

    getChangeFeedObj() {
        return new Observable();
    }

    addPointItem(_lat: number, _lng: number) {
        
    }

    syncPointItem(_lat: number, _lng: number) {
        
    }

    addUser(_username: string, _password: string, _role: string) {
        
    }

    syncUser(_username: string, _password: string, _role: string) {
        
    }

}