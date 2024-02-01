import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AzureUploadService {

    constructor(private http: HttpClient) { }

    uploadToAzure(blobUrl: string, file: File): Observable<any> {
        const headers = new HttpHeaders({
            'x-ms-blob-type': 'BlockBlob'
        });
        return this.http.put(blobUrl, file, { headers });
    }
}