import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class DialogService {
    confirm(message?: string): Observable<boolean> {
        const confirmation = window.confirm(message || 'Are you sure?');
        return confirmation as unknown as Observable<boolean>;
    };
} 