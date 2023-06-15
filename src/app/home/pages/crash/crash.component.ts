import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { combineLatest, map, Observable, tap } from "rxjs";
import { Store } from "@ngrx/store";
import { loadCrash } from "@app/app-state/crash/crash-action";
import { HeaderService } from "@app/shared/services/header-service";
import { CrashModel } from "@app/shared/models/crash.model";
import { selectCrash } from "@app/app-state/crash/crash-selector";
import { ModelState } from "@app/shared/models/base.model";
import { selectCars } from "@app/app-state/car/car-selector";
import { CarModel } from "@app/shared/models/car.model";
import { loadCars } from "@app/app-state/car/car-action";

@Component({
  selector: 'app-crash',
  templateUrl: './crash.component.html',
  styleUrls: ['./crash.component.scss']
})
export class CrashComponent implements OnInit {
  crash$: Observable<CrashModel> = this.store.select(selectCrash);
  cars$: Observable<CarModel[]> = this.store.select(selectCars);

  todoList: Observable<TodoItem[]> = this.generateTodoList();

  readonly ModelState = ModelState;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly headerService: HeaderService,
    private readonly router: Router,
    private readonly store: Store
  ) {
  }

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

  private generateTodoList(): Observable<TodoItem[]> {
    return combineLatest([
      this.crash$,
      this.cars$
    ]).pipe(
      map(([crash, cars]: [CrashModel, CarModel[]]) => {
        return [
          this.basicDataTodo(crash),
          this.inviteOtherParticipants(),
          ...this.generateCarPlaceholders(crash, cars),
          this.createCircumstancesTodo(crash, cars),
          this.createAccidentSketchTodo()
        ];
      }),
    );
  }

  private basicDataTodo(crashModel: CrashModel): TodoItem {
    return {
      name: 'car-crash.shared.todo_list.basic_data',
      state: crashModel.state,
      navigate: () => this.router.navigate(['accident-data'], {relativeTo: this.route}),
    };
  }

  private inviteOtherParticipants(): TodoItem {
    return {
      name: 'car-crash.shared.todo_list.invite_others',
      state: ModelState.empty,
      navigate: () => this.router.navigate(['invite'], {relativeTo: this.route}),
    };
  }

  private generateCarPlaceholders(crash: CrashModel, cars: CarModel[]): TodoItem[] {
    const carsTodoList: TodoItem[] = [];
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const myCarId = crash.my_cars?.[0];
    let index = 0;


    crash.cars?.forEach((carId) => {
      carsTodoList.push(
        {
          name: myCarId == carId ? 'car-crash.shared.todo_list.your_data' : 'car-crash.shared.todo_list.car_data',
          state: cars.find(car => car.id === carId)?.getCarModelState() || ModelState.empty,
          translateParams: {vehicle: alphabet.charAt(index).toUpperCase()},
          navigate: () => this.router.navigate([`cars/${carId}/policy-holder`], {relativeTo: this.route}),
        }
      );
      index++;
    });

    for (let j = 0; j < crash.participants - (crash.cars?.length || 0); j++) {
      carsTodoList.push(
        {
          name: 'car-crash.shared.todo_list.car_pending',
          state: ModelState.empty,
          translateParams: {vehicle: alphabet.charAt(index).toUpperCase()},
          navigate: () => this.router.navigate(['invite'], {relativeTo: this.route}),
        }
      );
      index++;
    }


    return carsTodoList;
  }

  private createCircumstancesTodo(crash: CrashModel, cars: CarModel[]): TodoItem {
    const myCarId = crash.my_cars?.[0];
    return {
      name: 'car-crash.shared.todo_list.accident_damage',
      state: cars.find(car => car.id === myCarId)?.getCarCircumstanceState() || ModelState.empty,
      navigate: () => this.router.navigate([`cars/${myCarId}/circumstances`], {relativeTo: this.route}),
    };
  }

  private createAccidentSketchTodo(): TodoItem {
    return {
      name: 'car-crash.shared.todo_list.accident_sketch',
      state: ModelState.empty,
      navigate: () => this.router.navigate(['accident-data'], {relativeTo: this.route}),
    };
  }
}

interface TodoItem {
  name: string;
  translateParams?: object;
  state: ModelState;
  navigate: () => void;
}
