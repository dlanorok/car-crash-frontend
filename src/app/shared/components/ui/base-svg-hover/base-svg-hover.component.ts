import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CarModel } from "../../../models/car.model";
import { combineLatest, ReplaySubject, Subscription, tap } from "rxjs";

@Component({
  template: '',
})
export abstract class BaseSvgHoverComponent implements AfterViewInit, OnDestroy, OnChanges, OnInit {

  @Input() car!: CarModel;
  protected selectedClass = 'selected';

  private readonly viewInit$: ReplaySubject<void> = new ReplaySubject<void>(1);
  private readonly change$: ReplaySubject<void> = new ReplaySubject<void>(1);
  private viewInitSub?: Subscription;
  protected listeners: any[] = [];
  protected selectedParts: string[] = [];

  abstract onViewReady(): void;
  abstract afterSvgItemClicked(): void;

  ngAfterViewInit(): void {
    this.viewInit$.next();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.change$.next();
  }

  ngOnDestroy(): void {
    this.viewInitSub?.unsubscribe();
    this.listeners.forEach(listener => listener());
  }

  ngOnInit(): void {
    this.viewInitSub = combineLatest([this.viewInit$, this.change$])
      .pipe(
        tap(() => {
          this.onViewReady();
        })
      ).subscribe()
  }

  protected onPathClick(event: any) {
    const clickedElement = event.currentTarget as HTMLElement;

    if (clickedElement.classList.contains(this.selectedClass)) {
      clickedElement.classList.remove(this.selectedClass)
      this.selectedParts.splice(this.selectedParts.indexOf(clickedElement.id), 1)
    } else {
      clickedElement.classList.add(this.selectedClass)
      this.selectedParts.push(clickedElement.id)
    }
    this.afterSvgItemClicked();
  }

}
