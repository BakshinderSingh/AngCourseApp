import {
  Component,
  OnInit,
  OnDestroy,ViewChild,ElementRef
} from '@angular/core';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit,OnDestroy {
  // @ViewChild('nameInput') nameInputRef: ElementRef;
  @ViewChild('f') formRef: NgForm;
  subscription:Subscription;
  editMode=false;
  editedItemIndex:number;
  editedItem:Ingredient;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.subscription=this.slService.startedEditing.subscribe(
      (index)=>{
        this.editMode=true;
        this.editedItemIndex=index;
        this.editedItem=this.slService.getIngredientsById(this.editedItemIndex);
        this.formRef.form.setValue({
          name:this.editedItem.name,
          amount:this.editedItem.amount          
        })
      }
    )
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  onSubmit(form:NgForm) {
    const value=form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if(this.editMode)
      this.slService.updateIngredient(this.editedItemIndex,newIngredient);
    else    
      this.slService.addIngredient(newIngredient);
      this.onClear();
  }

  onClear(){
    this.editMode=false;
    this.formRef.reset();
  }
  onDelete(){
    this.slService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }

}
