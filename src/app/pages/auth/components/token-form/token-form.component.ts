import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Keyboard } from '@capacitor/keyboard'

import {
  DefaultEnrolmentBaseURL,
  DefaultMetaTokenURI
} from '../../../../../assets/data/defaultConfig'
import { isValidURL } from '../../../../shared/utilities/form-validators'
import { Capacitor } from '@capacitor/core'

@Component({
  selector: 'token-form',
  templateUrl: 'token-form.component.html',
  styleUrls: ['./token-form.component.scss']
})
export class TokenFormComponent {
  @Input()
  loading: boolean

  @Output()
  data: EventEmitter<any> = new EventEmitter<any>()
  @Output()
  focus: EventEmitter<any> = new EventEmitter<any>()
  @Output()
  errors: EventEmitter<any> = new EventEmitter<any>()

  metaQRForm: FormGroup = new FormGroup({
    baseURL: new FormControl(DefaultEnrolmentBaseURL),
    tokenName: new FormControl('')
  })

  constructor() {}

  async submitForm() {
    if (Capacitor.isNativePlatform()) {
      await Keyboard.hide()
    }
    const baseURL = this.metaQRForm.get('baseURL').value.trim()
    const token = this.metaQRForm.get('tokenName').value.trim()
    if (!isValidURL(baseURL))
      return this.errors.emit({ error: { message: 'Enter a valid URL' } })
    this.data.emit(this.getURLFromToken(baseURL, token))
  }

  getURLFromToken(base, token) {
    return base + DefaultMetaTokenURI + token
  }

  onFocus() {
    this.focus.emit()
  }
}
