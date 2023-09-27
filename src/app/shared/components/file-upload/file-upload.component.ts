import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FilesApiService } from "../../api/files/files-api.service";
import { UploadedFile } from "../../common/uploaded-file";
import { tap } from "rxjs";
import { HttpEventType } from "@angular/common/http";
import { FileModel } from "@app/shared/models/fileModel";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  progress: number | null = null;
  uploadedFiles: FileModel[] = [];

  @Input() error: boolean | undefined = false;
  @Input() uploadedFileIds: number[] = [];
  @Input() fileListRenderer?: TemplateRef<void>;
  @Output() fileUploaded: EventEmitter<UploadedFile> = new EventEmitter<UploadedFile>();
  @Output() fileDeleted: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild('fileUploadInput', { read: ElementRef }) fileUploadInput!: ElementRef;

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
      const newFile = new FileModel({
        file_name: selectedFile.name,
        file_size: selectedFile.size,
      });
      this.uploadedFiles = [newFile, ...this.uploadedFiles];
      this.filesApiService.uploadFileWithProgress(selectedFile).pipe(
        tap((event: any) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.progress = Math.round((100 / event.total) * event.loaded);
          } else if (event.type == HttpEventType.Response) {
            this.fileUploaded.next(event.body);
            this.uploadedFiles = this.uploadedFiles.map((file) => {
              if (file.file_name === event.body.file_name) {
                file.id = event.body.id;
                file.file = event.body.file;
              }
              return file;
            });
            this.progress = null;
          }
        })
      ).subscribe();
    }
  }

  onFileUpload(): void {
    this.fileUploadInput.nativeElement.click();
  }

}
