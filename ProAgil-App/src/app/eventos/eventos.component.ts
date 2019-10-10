import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from 'src/_service/Evento.service';
import { Evento } from 'src/_model/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { defineLocale, BsLocaleService, ptBrLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  titulo = 'Eventos';

  eventosFiltrados: Evento[];
  eventos: Evento[];
  evento: Evento;
  imagemLargura = 50;
  imagemMargem  = 2;
  mostrarImagem = false;
  registerForm: FormGroup;
  modoSalvar = 'post';
  dataAtua: string;
  fileNomeToUpdate: string;

  file: File;

  _FILTROLISTA = '';
  bodyDeletarEvento = '';

  constructor(
      private eventoService: EventoService
    , private modalService: BsModalService
    , private fb: FormBuilder
    , private toastr: ToastrService
    , private localeService: BsLocaleService
    ) {
      this.localeService.use('pt-br');
     }

  get filtroLista(): string {
    return this._FILTROLISTA;
  }
  set filtroLista(value: string) {
    this._FILTROLISTA = value;
    this.eventosFiltrados = this.filtroLista ? this.filtraEvento(this.filtroLista) : this.eventos;
  }

  openModal(template: any) {
    this.registerForm.reset();
    template.show(template);
  }

  ngOnInit() {
    this.validation();
    this.getEventos();
  }

  filtraEvento(filtraPor: string): Evento[] {
    filtraPor = filtraPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtraPor) !== -1
    );
  }

  alternaImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  validation() {
    this.registerForm = this.fb.group ({
      tema: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(4)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      imgUrl: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(12000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  salvarAlteracao(template: any) {
    if (this.registerForm.valid) {
      if (this.modoSalvar === 'post') {
        this.evento = Object.assign({}, this.registerForm.value);

        this.uploadImage();

        this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento: Evento) => {
            template.hide();
            this.getEventos();
            this.toastr.success('Inserido com sucesso!');
          }, error => {
            this.toastr.error(`Erro ao enserir! ${error}`);
            console.log(error);
          }
        );
      } else {
        this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);

        this.uploadImage();

        this.eventoService.putEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.getEventos();
            this.toastr.success(`Atualizado com sucesso!`);
          }, error => {
            this.toastr.error(`Erro ao editar! ${error}`);
            console.log(error);
          }
        );
      }
    }
  }

  editarEvento(evento: Evento, template: any) {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = Object.assign({}, evento);
    this.fileNomeToUpdate = evento.imgUrl.toString();
    this.evento.imgUrl = '';
    this.registerForm.patchValue(this.evento);
  }

  novoEvento(template: any) {
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  getEventos() {
     this.eventoService.getAllEvento().subscribe(
       (_EVENTOS: Evento[]) => {
         this.eventos = _EVENTOS;
         this.eventosFiltrados = this.eventos;
       },
       error => {
         this.toastr.error(`Error ao pegar evento ${error}`);
       }
     );
  }

  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.tema}`;
  }

  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
          template.hide();
          this.getEventos();
          this.toastr.success('Evento deletedo com!');
        }, error => {
          this.toastr.error(`Error ao deletar ${error}`);
          console.log(error);
        }
    );
  }

  onFileChage(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files) {
      this.file = event.target.files;
    }
  }

  uploadImage() {

    if (this.modoSalvar === 'post') {

      const nomeArquivo = this.evento.imgUrl.split('\\', 3);
      this.evento.imgUrl = nomeArquivo[2];

      this.eventoService.postUpload(this.file, nomeArquivo[2])
        .subscribe(
          () => {
            this.dataAtua = new Date().getMilliseconds().toString();
            this.getEventos();
        });
    } else {
      this.evento.imgUrl = this.fileNomeToUpdate;
      this.eventoService.postUpload(this.file, this.fileNomeToUpdate)
        .subscribe(
          () => {
            this.dataAtua = new Date().getMilliseconds.toString();
            this.getEventos();
          }
        );
    }
  }
}
