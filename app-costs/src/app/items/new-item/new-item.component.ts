import { Component, OnInit, OnChanges, DoCheck, AfterContentChecked, AfterContentInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Base } from '../base.model'
import { ServisService } from '../servis.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.css']
})
export class NewItemComponent implements OnInit {
  sum: number;
  costFromArray: number;
  ostatak: number;
  salary: number;
  submitForm: FormGroup;
  naslov: string;
  base: Base[] = [];
  id: string;

  constructor(
    private fb: FormBuilder,
    private servis: ServisService,
    private router: Router) { }

  ngOnInit(): void {
    this.submitForm = this.fb.group({
      title: new FormControl('', Validators.required),
      salary: new FormControl('', Validators.required),
      'nameAdd': new FormArray([], Validators.required),
    });
    this.addForm();
  }

  // zbir troskova kad se sumbituje forma
  onSubmit() {
    this.findAllCosts();
    this.sendingToserver();
    this.servis.id.subscribe(resp => {
      this.id = resp;
      this.router.navigate(['/items', this.id]);
    });
  }
  //sabiranje svih troskova
  findAllCosts() {
    this.costFromArray = 0;
    for (let costs of this.submitForm.get('nameAdd').value) {
      this.costFromArray += costs.cost;
      let temp = { name: costs.name, cost: costs.cost };
      this.base.push(temp);
    }
  }
  addForm() {
    const arr = this.fb.group({
      name: new FormControl('', Validators.required),
      cost: new FormControl('', Validators.required)
    });
    (<FormArray>this.submitForm.get('nameAdd')).push(arr);
  }
  sendingToserver() {
    this.naslov = this.submitForm.get('title').value
    this.salary = this.submitForm.get('salary').value
    this.servis.addToPlan(this.naslov, this.salary, this.base);
    this.sum = this.costFromArray;
    this.ostatak = this.submitForm.get('salary').value - this.sum
  }
  deleteForm(i) {
    (<FormArray>this.submitForm.get('nameAdd')).removeAt(i);
  }
  getControlsOfName() {
    return (<FormArray>this.submitForm.get('nameAdd')).controls;
  }
}
