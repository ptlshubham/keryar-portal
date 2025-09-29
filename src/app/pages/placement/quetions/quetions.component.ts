import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-quetions',
  templateUrl: './quetions.component.html',
  styleUrl: './quetions.component.scss'
})
export class QuetionsComponent {
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

  categories: any = [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' }
  ];
  subcategories: any[] = [];
  subtosubcategories: any[] = [];

  categoryMap: any = {
    1: [{ id: 11, name: 'Subcat 1-1' }, { id: 12, name: 'Subcat 1-2' }],
    2: [{ id: 21, name: 'Subcat 2-1' }]
  };
  subcategoryMap: any = {
    11: [{ id: 111, name: 'Subsubcat 1-1-1' }],
    12: [{ id: 121, name: 'Subsubcat 1-2-1' }],
    21: [{ id: 211, name: 'Subsubcat 2-1-1' }]
  };

  get isQuestionValid(): boolean {
    const enteredQuestions = this.questionData.filter(q => q.question_text && q.question_text.trim().length > 0);
    if (enteredQuestions.length === 0) return false;
    return enteredQuestions.every(q => q.weight !== null && q.weight !== undefined && q.weight.toString().trim().length > 0);
  }

  get isFormValid(): boolean {
    // Debugging: log why the form might be invalid
    if (!this.validationForm.valid) {
      console.log('Form invalid:', this.validationForm);
    }
    // if (!this.isQuestionValid) {
    //   console.log('Questions invalid:', this.questionData);
    // }
    return this.validationForm.valid && this.isQuestionValid;
  }

  fromCharCode(code: number): string {
    return String.fromCharCode(code);
  }
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
  }
  ngOnInit(): void {
    this.validationForm = this.fb.group({
      type: ['School', Validators.required],           // ← add this
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      subtosubcategory: ['', Validators.required],
    });
    this.getAllSelfQuestionSetDetails();
  }

  get f() { return this.validationForm.controls; }

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
        questions: this.questionData.filter(q => q.question_text && q.question_text.trim().length > 0).map(q => ({
          question_text: q.question_text,
          option_type: q.option_type,
          weight: q.weight,
          optionsArr: q.optionsArr,
        })),
        year: new Date().getFullYear(),
        isactive: true
      }

      //   this.teacherEvaluationService.saveSelfAssessmentQuestionSetDetails(data).subscribe((res: any) => {
      //     this.formReset();
      //     this.getAllSelfQuestionSetDetails();
      //     this.isUpdate = false;
      //     this.isOpen = false;
      //     this.toastr.success('Question set saved successfully.');
      //   }, (error) => {
      //     this.toastr.error('Error saving question set.');
      //   });
      // } else {
      //   let msg = '';
      //   if (!this.isQuestionValid) {
      //     msg += 'Please enter at least one question.';
      //   }
      //   this.toastr.error(msg || 'Please fill all required fields and questions.');
      // }
    }
  }

  formReset() {
    this.validationForm.reset({
      type: 'School',           // ← keep default consistent
      category: '',
      subcategory: '',
      subtosubcategory: ''
    });
    this.questionData = [{
      question_text: null,
      option_type: '',
      weight: null,
      optionsArr: [{ options: '', value: null }]
    }];
  }

  getAllSelfQuestionSetDetails() {
    // this.teacherEvaluationService.getAllSelfQuestionSetDetails().subscribe((res: any) => {

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
    // this.teacherEvaluationService.removeSelfAssessmentQuestionSet(id).subscribe((res: any) => {
    //   this.toastr.success('Question set removed successfully.');
    //   this.getAllSelfQuestionSetDetails();
    // }, (error) => {
    //   this.toastr.error('Error removing question set.');
    // });
  }

  editQuestionSet(data: any) {
    this.questionModel = {};

    this.questionModel = data;
    // Use the passed data object directly
    this.validationForm.patchValue({
      type: data.type
    });
    this.questionData = data.questions;
    this.isUpdate = true;
    this.isOpen = true;
  }

  updateSelfQuestionSet() {
    const data = {
      id: this.questionModel.id,
      type: this.validationForm.value.type,
      questions: this.questionData
        .filter(q => q.question_text && q.question_text.trim().length > 0)
        .map(q => ({
          queid: q.queid, // include question ID if present
          question_text: q.question_text,
          option_type: q.option_type,
          weight: q.weight,
          optionsArr: Array.isArray(q.optionsArr)
            ? q.optionsArr.map((opt: any) => ({
              id: opt.id, // include option ID if present
              options: opt.options,
              value: opt.value
            }))
            : [],
        })),
      year: new Date().getFullYear(),
      isactive: true
    };

    // this.teacherEvaluationService.updateSelfQuestionSetDetails(data).subscribe((res: any) => {
    //   this.toastr.success('Question set updated successfully.');
    //   this.getAllSelfQuestionSetDetails();
    //   this.formReset();
    //   this.isOpen = false;
    //   this.isUpdate = false;
    // }, (error) => {
    //   this.toastr.error('Error updating question set.');
    // });
  }

  onCategoryChange(categoryId: any) {
    this.subcategories = this.categoryMap[categoryId] || [];
    this.validationForm.patchValue({ subcategory: '', subtosubcategory: '' });
    this.subtosubcategories = [];
  }

  onSubcategoryChange(subcategoryId: any) {
    this.subtosubcategories = this.subcategoryMap[subcategoryId] || [];
    this.validationForm.patchValue({ subtosubcategory: '' });
  }

}