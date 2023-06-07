import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { map, Observable, of, tap } from "rxjs";
import { Store } from "@ngrx/store";
import { loadCrash } from "@app/app-state/crash/crash-action";
import { HeaderService } from "@app/shared/services/header-service";
import { CrashModel } from "@app/shared/models/crash.model";
import { selectCrash } from "@app/app-state/crash/crash-selector";
import { ModelState } from "@app/shared/models/base.model";
import { selectCars } from "@app/app-state/car/car-selector";
import { CarModel } from "@app/shared/models/car.model";
import { CookieService } from "ngx-cookie-service";
import { CookieName } from "@app/shared/common/enumerators/cookies";
import { loadCars } from "@app/app-state/car/car-action";

@Component({
  selector: 'app-crash',
  templateUrl: './crash.component.html',
  styleUrls: ['./crash.component.scss']
})
export class CrashComponent implements OnInit {
  crash$: Observable<CrashModel> = this.store.select(selectCrash);
  cars$: Observable<CarModel[]> = this.store.select(selectCars);

  todoList: TodoItem[] = [
    {
      name: 'car-crash.shared.todo_list.basic_data',
      state: this.crash$.pipe(map((crashModel) => crashModel.state)),
      navigate: () => this.router.navigate(['accident-data'], { relativeTo: this.route }),
    },
    {
      name: 'car-crash.shared.todo_list.invite_others',
      state: of(ModelState.empty),
      navigate: () => this.router.navigate(['invite-others'], { relativeTo: this.route }),
    },
    {
      name: 'car-crash.shared.todo_list.your_data',
      state: this.cars$.pipe(
        map((cars: CarModel[]) => cars.find(
          car => car.creator === this.cookieService.get(CookieName.sessionId))
        ),
        map((car: CarModel | undefined) => {
          if (!car) {
            return ModelState.empty;
          }

          return car.getCarModelState();
        })
      ),
      navigate: () => this.router.navigate(['cars/my-car/policy-holder'], { relativeTo: this.route }),
    },
    {
      name:'car-crash.shared.todo_list.accident_damage',
      state: this.cars$.pipe(
        map((cars: CarModel[]) => cars.find(
          car => car.creator === this.cookieService.get(CookieName.sessionId))
        ),
        map((car: CarModel | undefined) => {
          if (!car) {
            return ModelState.empty;
          }

          return car.getCarCircumstanceState();
        })
      ),
      navigate: () => this.router.navigate(['cars/my-car/circumstances'], { relativeTo: this.route }),
    },
    {
      name: 'car-crash.shared.todo_list.accident_sketch',
      state: of(ModelState.empty),
      navigate: () => this.router.navigate(['accident-data'], { relativeTo: this.route }),
    }
  ];

  readonly ModelState = ModelState;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly headerService: HeaderService,
    private readonly router: Router,
    private readonly store: Store,
    private readonly cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.headerService.setHeaderData({name: '§§Accident statement', preventBack: true});
    this.getData();
  }

  getData(): void {
    this.route.paramMap
      .pipe(
        map(params => params.get('sessionId')),
        tap((sessionId: string | null) => {
          if (sessionId) {
            this.store.dispatch(loadCrash({sessionId: sessionId}));
            this.store.dispatch(loadCars());
          }
        }),
      )
      .subscribe();
  }
}

interface TodoItem {
  name: string;
  state: Observable<ModelState>;
  navigate: () => void;
}
