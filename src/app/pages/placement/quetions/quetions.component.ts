import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PlacementService } from 'src/app/core/services/placement.service';

@Component({
  selector: 'app-quetions',
  templateUrl: './quetions.component.html',
  styleUrls: ['./quetions.component.scss']
})
export class QuetionsComponent implements OnInit {
  validationForm!: FormGroup;
  isOpen = false;
  isUpdate = false;

  page = 1;
  pageSize = 10;
  collectionSize = 0;
  paginateData: any = [];

  questionData: any[] = [{ question_text: null, option_type: '', weight: null, optionsArr: [{ options: '', value: null }] }];
  questionModel: any = {};
  viewQuestions: any = {};

  questionsSetData: any = [];

  categories: any[] = [];
  subcategories: any[] = [];
  subtosubcategories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private placementService: PlacementService
  ) { }

  ngOnInit(): void {
    this.validationForm = this.fb.group({
      type: ['School', Validators.required],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      subtosubcategory: ['', Validators.required],
    });

    // Disable subcategory and sub-to-sub category initially
    this.validationForm.get('subcategory')?.disable();
    this.validationForm.get('subtosubcategory')?.disable();

    // Fetch categories and initialize data
    this.getCategories();
    this.getAllSelfQuestionSetDetails();
  }

  get f() { return this.validationForm.controls; }

  get isQuestionValid(): boolean {
    const enteredQuestions = this.questionData.filter(q => q.question_text && q.question_text.trim().length > 0);
    if (enteredQuestions.length === 0) return false;
    return enteredQuestions.every(q => q.weight !== null && q.weight !== undefined && q.weight.toString().trim().length > 0);
  }

  get isFormValid(): boolean {
    return this.validationForm.valid && this.isQuestionValid;
  }

  fromCharCode(code: number): string {
    return String.fromCharCode(code);
  }

  // Fetch all active categories
  getCategories() {
    this.placementService.getAllActivePlacementCategory().subscribe({
      next: (res: any) => {
        this.categories = res; // Assuming res is an array of { id, name, isactive, ... }
        console.log('Fetched categories:', this.categories);
      },
      error: (err) => {
        this.toastr.error('Failed to fetch categories', 'Error');
        console.error('Error fetching categories:', err);
      }
    });
  }

  // Fetch subcategories based on selected category
  onCategoryChange(categoryId: any) {
    this.subcategories = [];
    this.subtosubcategories = [];
    this.validationForm.patchValue({ subcategory: '', subtosubcategory: '' });
    this.validationForm.get('subcategory')?.disable();
    this.validationForm.get('subtosubcategory')?.disable();

    if (categoryId) {
      this.placementService.getAllActiveSubCategory().subscribe({
        next: (res: any) => {
          this.subcategories = res.data.filter((sc: any) => sc.categoriesid === categoryId);
          console.log('Filtered subcategories:', this.subcategories);
          if (this.subcategories.length > 0) {
            this.validationForm.get('subcategory')?.enable();
          }
        },
        error: (err) => {
          this.toastr.error('Failed to fetch subcategories', 'Error');
          console.error('Error fetching subcategories:', err);
        }
      });
    }
  }

  // Fetch sub-to-sub categories based on selected subcategory
  onSubcategoryChange(subcategoryId: any) {
    this.subtosubcategories = [];
    this.validationForm.patchValue({ subtosubcategory: '' });
    this.validationForm.get('subtosubcategory')?.disable();

    if (subcategoryId) {
      this.placementService.getAllActiveSubToSubCategory().subscribe({
        next: (res: any) => {
          this.subtosubcategories = res.data
            .filter((ssc: any) => ssc.subcategoriesid === subcategoryId)
            .map((ssc: any) => ({
              id: ssc.id, // Use the single id field
              name: ssc.name // Use the name field directly
            }));
          console.log('Filtered sub-to-sub categories:', this.subtosubcategories);
          if (this.subtosubcategories.length > 0) {
            this.validationForm.get('subtosubcategory')?.enable();
          }
        },
        error: (err) => {
          this.toastr.error('Failed to fetch sub-to-sub categories', 'Error');
          console.error('Error fetching sub-to-sub categories:', err);
        }
      });
    }
  }
  openQuestionset() {
    this.isOpen = true;
    this.isUpdate = false;
    this.formReset();
  }

  closeQuestionset() {
    this.isOpen = false;
    this.isUpdate = false;
  }

  addQuestion() {
    this.questionData.push({ question_text: null, option_type: '', weight: null, optionsArr: [{ options: '', value: null }] });
  }

  removeQuestion(index: number) {
    if (this.questionData.length > 1) {
      this.questionData.splice(index, 1);
    }
  }

  addOption(qIndex: number) {
    if (!this.questionData[qIndex].optionsArr) {
      this.questionData[qIndex].optionsArr = [];
    }
    this.questionData[qIndex].optionsArr.push({ options: '', value: null });
  }

  removeOption(qIndex: number, optIndex: number) {
    if (this.questionData[qIndex].optionsArr && this.questionData[qIndex].optionsArr.length > 1) {
      this.questionData[qIndex].optionsArr.splice(optIndex, 1);
    }
  }

  saveQuestionList() {
    if (this.isFormValid) {
      let data = {
        type: this.validationForm.value.type,
        categoryId: this.validationForm.value.category,
        subcategoryId: this.validationForm.value.subcategory,
        subtosubcategoryId: this.validationForm.value.subtosubcategory,
        questions: this.questionData.filter(q => q.question_text && q.question_text.trim().length > 0).map(q => ({
          question_text: q.question_text,
          option_type: q.option_type,
          weight: q.weight,
          optionsArr: q.optionsArr,
        })),
        year: new Date().getFullYear(),
        isactive: true
      };

      // Implement the service call to save the question set
      // this.placementService.saveSelfAssessmentQuestionSetDetails(data).subscribe((res: any) => {
      //   this.formReset();
      //   this.getAllSelfQuestionSetDetails();
      //   this.isUpdate = false;
      //   this.isOpen = false;
      //   this.toastr.success('Question set saved successfully.');
      // }, (error) => {
      //   this.toastr.error('Error saving question set.');
      // });
    } else {
      let msg = '';
      if (!this.isQuestionValid) {
        msg += 'Please enter at least one question with a valid weight.';
      }
      this.toastr.error(msg || 'Please fill all required fields and questions.');
    }
  }

  formReset() {
    this.validationForm.reset({
      type: 'School',
      category: '',
      subcategory: '',
      subtosubcategory: ''
    });
    this.validationForm.get('subcategory')?.disable();
    this.validationForm.get('subtosubcategory')?.disable();
    this.questionData = [{
      question_text: null,
      option_type: '',
      weight: null,
      optionsArr: [{ options: '', value: null }]
    }];
    this.subcategories = [];
    this.subtosubcategories = [];
  }

  getAllSelfQuestionSetDetails() {
    // Implement the service call to fetch question sets
    // this.placementService.getAllSelfQuestionSetDetails().subscribe((res: any) => {
    //   for (let i = 0; i < res.length; i++) {
    //     res[i].index = i + 1;
    //   }
    //   this.questionsSetData = res;
    //   this.collectionSize = this.questionsSetData.length;
    //   this.getPagintaion();
    // }, (error) => {
    //   this.toastr.error('Error fetching question sets.');
    // });
  }

  getPagintaion() {
    this.paginateData = this.questionsSetData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  openQuestionList(exlargeModal: any, data: any) {
    this.viewQuestions = { ...data };
    this.modalService.open(exlargeModal, { size: 'lg', windowClass: 'modal-holder', centered: true });
  }

  removeSelfAssessmentQuestionSet(id: any) {
    // Implement the service call to remove question set
    // this.placementService.removeSelfAssessmentQuestionSet(id).subscribe((res: any) => {
    //   this.toastr.success('Question set removed successfully.');
    //   this.getAllSelfQuestionSetDetails();
    // }, (error) => {
    //   this.toastr.error('Error removing question set.');
    // });
  }

  editQuestionSet(data: any) {
    this.questionModel = { ...data };
    this.validationForm.patchValue({
      type: data.type,
      category: data.categoryId,
      subcategory: data.subcategoryId,
      subtosubcategory: data.subtosubcategoryId
    });
    this.questionData = data.questions;
    this.isUpdate = true;
    this.isOpen = true;

    // Fetch subcategories and sub-to-sub categories for editing
    if (data.categoryId) {
      this.onCategoryChange(data.categoryId);
      if (data.subcategoryId) {
        this.onSubcategoryChange(data.subcategoryId);
      }
    }
  }

  updateSelfQuestionSet() {
    const data = {
      id: this.questionModel.id,
      type: this.validationForm.value.type,
      categoryId: this.validationForm.value.category,
      subcategoryId: this.validationForm.value.subcategory,
      subtosubcategoryId: this.validationForm.value.subtosubcategory,
      questions: this.questionData
        .filter(q => q.question_text && q.question_text.trim().length > 0)
        .map(q => ({
          queid: q.queid,
          question_text: q.question_text,
          option_type: q.option_type,
          weight: q.weight,
          optionsArr: Array.isArray(q.optionsArr)
            ? q.optionsArr.map((opt: any) => ({
              id: opt.id,
              options: opt.options,
              value: opt.value
            }))
            : [],
        })),
      year: new Date().getFullYear(),
      isactive: true
    };

    // Implement the service call to update question set
    // this.placementService.updateSelfQuestionSetDetails(data).subscribe((res: any) => {
    //   this.toastr.success('Question set updated successfully.');
    //   this.getAllSelfQuestionSetDetails();
    //   this.formReset();
    //   this.isOpen = false;
    //   this.isUpdate = false;
    // }, (error) => {
    //   this.toastr.error('Error updating question set.');
    // });
  }
}