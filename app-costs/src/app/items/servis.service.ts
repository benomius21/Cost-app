import { Base } from './base.model'
import { Plan } from './base.model'
import { Injectable } from '@angular/core';
import { InputService } from './input.service';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { Params } from '@angular/router';


@Injectable()
export class ServisService {
  base: Base[] = [];
  plan: Plan[] = [];
   planObv = new Subject<Plan[]>();
  jedanPlan = new Subject<Plan[]>();
  id = new Subject<string>();
  itemDeleted = new Subject<boolean>();

  constructor(private inputServis: InputService, private http: HttpClient) { }

  getAllPlans() {
    this.http.get<{ plans: Plan[] }>('http://localhost:3000/')
      .subscribe((resp) => {
        this.plan = resp.plans;
        this.planObv.next(this.plan);
        this.plan = [];
      });
  }
  getOnePlan(id: Params) {
    this.http.get<{ plan: Plan }>('http://localhost:3000/items/' + id)
      .subscribe((resp) => {
        this.plan.push(resp.plan);
        this.jedanPlan.next(this.plan);
        this.plan = [];
      });
  }
  getPlanObv() {
    return this.planObv.asObservable();
  }
  getJedanPlanObv() {
    return this.jedanPlan.asObservable();
  }

  returnPlans() {
    return this.plan
  }
  getBase() {
    return this.base;
  }
  getPlanCost() {
    this.plan.forEach(plan => {
      plan.expenses.forEach(trosak => {
        let troskoviObj = { name: trosak.name, cost: trosak.cost }
        this.base.push(troskoviObj);
      })
    })
  }
  updatePlan(title:string, salary:number, expenses: Base[], id: Params){
    const y: Plan = { _id: null, title: title, salary: salary, expenses: expenses }
    this.http.put('http://localhost:3000/items/'+id+'/edit', y)
      .subscribe((resp) => {
    });
  }
  addToPlan(title: string, salary: number, expenses: Base[]) {
    const x: Plan = { _id: null, title: title, salary: salary, expenses: expenses }
    this.http.post<{id:string}>('http://localhost:3000/new', x)
      .subscribe((resp) => {
        this.id.next(resp.id);
    });
  }

  deletePlan(id: string){
      this.http.delete('http://localhost:3000/items/'+id)
      .subscribe((resp)=>{
        this.itemDeleted.next(true);

      });

  }
}

