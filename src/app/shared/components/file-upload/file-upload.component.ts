import { Component, EventEmitter, Output } from '@angular/core';
import { FilesApiService } from "../../api/files/files-api.service";
import { UploadedFile } from "../../common/uploaded-file";
import { tap } from "rxjs";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  uploadedFiles: (string | ArrayBuffer)[] = [];

  @Output() fileUploaded: EventEmitter<UploadedFile> = new EventEmitter<UploadedFile>();

  constructor(private readonly filesApiService: FilesApiService) {}

  onFileSelected(event: any): void {
    this.uploadFile(event.target.files[0]);
  }

  uploadFile(selectedFile: File | null): void {
    if (selectedFile) {
      this.generatePreview(selectedFile);
      this.filesApiService.uploadFile(selectedFile).pipe(
        tap((uploadedFile: UploadedFile) => {
          this.fileUploaded.next(uploadedFile);
        })
      ).subscribe();
    }
  }

  private generatePreview(selectedFile: File) {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        this.uploadedFiles.push(reader.result);
      }
    };
    reader.readAsDataURL(selectedFile);
  }

}
