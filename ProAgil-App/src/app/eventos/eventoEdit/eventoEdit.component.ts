import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { EventoService } from 'src/_service/Evento.service';
import { BsModalService, BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Evento } from 'src/_model/Evento';

@Component({
  selector: 'app-evento-edit',
  templateUrl: './eventoEdit.component.html',
  styleUrls: ['./eventoEdit.component.css']
})
export class EventoEditComponent implements OnInit {

  titulo = 'Editar evento';
  evento: Evento = new Evento();
  imagemURL = 'assets/img/upload.png';
  registerForm: FormGroup;
  file: File;
  fileNameToUpdate: string;

  dataAtual = '';

  get lotes(): FormArray{
    return <FormArray>this.registerForm.get('lotes');
  }

  get redesSociais(): FormArray {
    return <FormArray>this.registerForm.get('redesSociais');
  }

  constructor(
    private eventoService: EventoService  
  , private fb: FormBuilder
  , private toastr: ToastrService
  , private router: ActivatedRoute
  , private localeService: BsLocaleService
  ) {
    this.localeService.use('pt-br');
  }

  ngOnInit() {
    this.validation();
    this.carregarEvento();
  }

  validation() {
    
  }

  carregarEvento() {
      const idEvento = +this.router.snapshot.paraMap.get('id');
      this.eventoService.getEventoById(idEvento)
        .subscrible(
          (evento: Evento) => {
            this.evento = Object.assign({}, evento);
            this.fileNameToUpdate = evento.imgUrl.toString();

            this.imagemURL = `http://localhost:5000/resources/images/${this.evento.imgUrl}?_ts=${this.dataAtual}`;

            this.evento.imgUrl = '';
            this.registerForm.patcValue(this.evento);

            this.evento.lotes.forEach(lote => {
              this.lotes.push(this.criaLote(lote));
            });
            this.evento.redesSociais.forEach(redeSocial => {
              this.redesSociais.push(this.criaRedeSocial(redeSocial));
            });
          }
        );
  }

  validation() {
    this.registerForm = this.fb.group({
      id: [],
      tema: ['', [Validators.required, Validators.minLangth(4), Validators.maxLength(50)]],
      local: ['', [Validators.required]],
      dataEvento: ['', [Validators.required]],
      imagemURL: [''],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      lotes: this.fb.array([]),
      redesSociais: this.fb.array([])
    });
  }

  criaLote(lote: any): FormGroup {
    return this.fb.group({

    });
  }
}
