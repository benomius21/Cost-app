import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServisService } from '../servis.service';
import { Plan } from '../base.model';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/signIn/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit, OnDestroy {
  plan: Plan[] = [];
  itemDeleted = false;
  obvUnsub: Subscription;
  id = new Subject<string>();

  constructor
  (private servis: ServisService, 
    private authServis: AuthService, 
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.servis.getAllPlans();
    this.obvUnsub = this.servis.getPlanObv().subscribe((plans) => {
      this.plan = plans;
    });

  }

  delete(id: string) {
    this.servis.deletePlan(id);
    this.servis.getAllPlans();
   

  }

  ngOnDestroy() {
    this.obvUnsub.unsubscribe();

  }
}
