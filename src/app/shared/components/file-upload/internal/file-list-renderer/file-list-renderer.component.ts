import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, Observable, zip, switchMap, of } from "rxjs";
import { FileModel } from "@app/shared/models/fileModel";
import { FilesApiService } from "@app/shared/api/files/files-api.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'app-file-list-renderer',
  templateUrl: './file-list-renderer.component.html',
  styleUrls: ['./file-list-renderer.component.scss']
})
export class FileListRendererComponent implements OnInit {
  private readonly filesApiService: FilesApiService = inject(FilesApiService);

  private readonly fileIds$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  @Input() set fileIds(fileIds: number[]) {
    this.fileIds$.next(fileIds);
  }
  @Output() removeFile: EventEmitter<number> = new EventEmitter<number>();

  files: FileModel[] = [];

  private readonly files$: Observable<(FileModel | undefined)[]> = this.fileIds$.pipe(
    distinctUntilChanged(),
    switchMap((fileIds) => {
      const currentFiles = this.files.map(file => file.id);
      return zip(fileIds.map(fileId => {
        return currentFiles.includes(fileId)
          ? of(undefined)
          : this.filesApiService.getFileData(fileId);
      }));
    }),
    untilDestroyed(this)
  );

  ngOnInit() {
    this.files$.subscribe((files) => {
      files.forEach(file => {
        if (file) {
          this.files.push(file);
        }
      });
    });
  }

  removeFileFromList(fileId: number): void {
    this.files = this.files.filter(file => file.id !== fileId);
    this.removeFile.next(fileId);
  }
}
