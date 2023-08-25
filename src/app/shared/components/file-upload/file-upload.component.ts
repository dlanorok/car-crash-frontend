import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilesApiService } from "../../api/files/files-api.service";
import { UploadedFile } from "../../common/uploaded-file";
import { tap } from "rxjs";
import { HttpEventType } from "@angular/common/http";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  progress: number | null = null;

  closeSvg = require('src/assets/icons/close.svg');

  @Input() error: boolean | undefined = false;
  @Input() uploadedFileIds: number[] = [];
  @Output() fileUploaded: EventEmitter<UploadedFile> = new EventEmitter<UploadedFile>();
  @Output() fileDeleted: EventEmitter<number> = new EventEmitter<number>();

  constructor(private readonly filesApiService: FilesApiService) {}

  removeFile(fileId: number) {
    this.uploadedFileIds = this.uploadedFileIds.filter(_fileId => _fileId !== fileId);
    this.fileDeleted.next(fileId);
  }

  onFileSelected(event: any): void {
    this.uploadFile(event.target.files[0]);
  }

  uploadFile(selectedFile: File | null): void {
    if (selectedFile) {
      this.filesApiService.uploadFile(selectedFile).pipe(
        tap((event: any) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.progress = Math.round((100 / event.total) * event.loaded);
          } else if (event.type == HttpEventType.Response) {
            this.fileUploaded.next(event.body);
            this.progress = null;
          }
        })
      ).subscribe();
    }
  }

}
