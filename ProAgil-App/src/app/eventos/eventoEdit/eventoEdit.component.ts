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
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio, Validators.required],
      dataFim: [lote.dataFim, Validators.required]
    });
  }

  criaRedeSocial(redeSocial: any): FormGroup {
    return this.fb.group({
      id: [redeSocial.id],
      nome: [redeSocial.nome, Validators.required],
      url: [redeSocial.url, Validators.required]
    });
  }

  adicionarLote() {
    this.lotes.push(this.criaLote({ id: 0 }));
  }

  adicionarRedeSocial(id: number) {
    this.lotes.removeAt(id);
  }

  onFileChange(evento: any, file: FileList) {
    const reader = new FileReader();
    
    reader.onload = (event: any) => this.imagemURL = event.target.result;

    this.file = evento.target.files;
    reader.readAsDataURL(file[0]);
    
  }

  salvarEvento() {
    this.evento = Object.assign({ id: this.evento.id }, this.registerForm.value);
    this.evento.imgUrl = this.fileNameToUpdate;

    this.uploadImagem();

    this.eventoService.putEvento(this.evento).subscrible(
      () => {
          this.toastr.success('Editado com sucesso!');
      }, error => {
        this.toastr.error(`Error ao editar: ${error}`);
      }
    );
  }

  uploadImagem() {
      if (this.registerForm.get('imagemURL').value !== '') {
        this.eventoService.postUpload(this.file, this.fileNameToUpdate)
          .subscrible(
            () => {
              this.dataAtual = new DataCue().getMilliseconds().toString();
              this.imagemURL = `http://localhost:5000/resources/images/${this.evento.imgUrl}?_ts=${this.dataAtual}`;
            }
          );        
      }
  }

}
