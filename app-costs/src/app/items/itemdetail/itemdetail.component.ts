import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { Plan, Base } from '../base.model'
import { ServisService } from '../servis.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/signIn/auth.service';

@Component({
  selector: 'app-itemdetail',
  templateUrl: './itemdetail.component.html',
  styleUrls: ['./itemdetail.component.css']
})

export class ItemdetailComponent implements OnInit, OnDestroy {
  numberOfForms;
  zbirTroskova: Number;
  razlika: Number;
  plan: Plan[] = [];
  base: Base[] = [];
  naslov: string;
  salary: number;
  id: Params;
  submitForm: FormGroup;
  unsub: Subscription;
  token = false;
  sub: Subscription;
  itemDelUnSub: Subscription;


  constructor(private fb: FormBuilder,
    private servis: ServisService,
    private route: ActivatedRoute,
    private authServis: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.id = this.route.snapshot.params['id'];
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.servis.getOnePlan(this.id);
      this.clearFormAndAdd();


      this.unsub = this.servis.jedanPlan.subscribe((plans) => {
        this.plan = plans;
        this.getPlanCost();
        this.getNaslovSalary();
        this.updateForm();
        this.fillForms();
        this.findAllCosts();
      });

    });
    this.itemDelUnSub = this.servis.itemDeleted.subscribe(resp => {
      this.router.navigate(['/items']);
    })


    this.sub = this.authServis.isToken.subscribe(odg => {
      this.token = odg;
    });

  }
  ngOnDestroy() {
    this.unsub.unsubscribe();
    this.sub.unsubscribe();
    this.itemDelUnSub.unsubscribe();
  }

  onUpdate() {
    this.findAllCosts();
    this.updateToServer();
  }

  clearFormAndAdd() {
    this.submitForm = this.fb.group({
      title: new FormControl(this.naslov),
      salary: new FormControl(this.salary),
      'nameAdd': new FormArray([]),
    });
    this.numberOfForms = (<FormArray>this.submitForm.get('nameAdd')).length
  }

  findAllCosts() {
    this.zbirTroskova = 0;
    this.razlika = 0;
    this.base = [];
    for (let costs of this.submitForm.get('nameAdd').value) {
      this.zbirTroskova += costs.cost;
      let temp = { name: costs.name, cost: costs.cost };
      this.base.push(temp);
    }
    this.razlika = +this.salary - +this.zbirTroskova;
  }

  updateToServer() {
    this.naslov = this.submitForm.get('title').value
    this.salary = this.submitForm.get('salary').value
    this.servis.updatePlan(this.naslov, this.salary, this.base, this.id);
  }

  updateForm() {
    this.submitForm.get('title').setValue(this.naslov);
    this.submitForm.get('salary').setValue(this.salary);
  }

  getNaslovSalary() {
    this.plan.forEach(item => {
      this.naslov = item.title;
      this.salary = item.salary;
    });
  }

  getPlanCost() {
    this.base = [];
    this.plan.forEach(plan => {
      plan.expenses.forEach(trosak => {
        let troskoviObj = { name: trosak.name, cost: trosak.cost }
        this.base.push(troskoviObj);
      })
    })
  }

  deleteForm(i) {
    (<FormArray>this.submitForm.get('nameAdd')).removeAt(i);
  }

  getControlsOfName() {
    return (<FormArray>this.submitForm.get('nameAdd')).controls;
  }

  fillForms() {
    if (this.numberOfForms >= this.plan.length) {
      return;
    } else {
      for (let i = 0; i < this.plan.length; i++) {
        for (let j = 0; j < this.base.length; j++) {
          const arr = this.fb.group({
            name: new FormControl(this.plan[i].expenses[j].name),
            cost: new FormControl(this.plan[i].expenses[j].cost)
          });
          (<FormArray>this.submitForm.get('nameAdd')).push(arr);
        }
      }
    }
    this.numberOfForms = (<FormArray>this.submitForm.get('nameAdd')).length;
  }

  addForm() {
    if (this.numberOfForms >= this.plan.length) {
      const arr = this.fb.group({
        name: new FormControl(),
        cost: new FormControl()
      });
      (<FormArray>this.submitForm.get('nameAdd')).push(arr);
    } else if (this.numberOfForms == 0) {
      const arr = this.fb.group({
        name: new FormControl(),
        cost: new FormControl()
      });
      (<FormArray>this.submitForm.get('nameAdd')).push(arr);
    }
    else {
      for (let i = 0; i < this.plan.length; i++) {
        for (let j = 0; j < this.base.length; j++) {
          const arr = this.fb.group({
            name: new FormControl(this.plan[i].expenses[j].name),
            cost: new FormControl(this.plan[i].expenses[j].cost)
          });
          (<FormArray>this.submitForm.get('nameAdd')).push(arr);
        }
      }
    }
    this.numberOfForms = (<FormArray>this.submitForm.get('nameAdd')).length;
  }
}



