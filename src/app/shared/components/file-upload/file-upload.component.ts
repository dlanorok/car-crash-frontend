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
  selectedFile: File | null = null;

  @Output() fileUploaded: EventEmitter<UploadedFile> = new EventEmitter<UploadedFile>();

  constructor(private readonly filesApiService: FilesApiService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (this.selectedFile) {
      this.filesApiService.uploadFile(this.selectedFile).pipe(
        tap((uploadedFile: UploadedFile) => {
          this.fileUploaded.next(uploadedFile);
        })
      ).subscribe();
    }
  }

}
