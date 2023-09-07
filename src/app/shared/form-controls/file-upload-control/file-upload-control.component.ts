import { Component, Input } from '@angular/core';
import { BaseFormControlComponent } from "@app/shared/form-controls/base-form-control.component";
import { UploadedFile } from "@app/shared/common/uploaded-file";

@Component({
  selector: 'app-file-upload-control',
  templateUrl: './file-upload-control.component.html',
  styleUrls: ['./file-upload-control.component.scss']
})
export class FileUploadControlComponent extends BaseFormControlComponent<number[]>{
  @Input() mode: 'default' | 'multiple' = 'multiple';

  private file_ids: number[] = [];

  onFileUpload(file: UploadedFile) {
    if (this.mode === 'default') {
      this.file_ids = [file.id];
    }
    this.file_ids.push(file.id);
    this.handleModelChange(this.file_ids);
  }

  onFileDelete(file_id: number) {
    if (this.mode === 'default') {
      this.file_ids = [];
    } else {
      this.file_ids = this.file_ids.filter(_file_id => _file_id !== file_id);
    }
    this.handleModelChange(this.file_ids);
  }
}
