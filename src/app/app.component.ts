import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'pIndexedDB';
  
  public _name: string;
  public _codi: string;
  public _anio: string;
  public _nameBD: string;
  
  public dataTests :any = [];
  public cursorLength: number = 0;
  
  public arrDB: any = [];

  ngOnInit() {
    this.readDB();
    if (!window.indexedDB) {
      window.alert("Su navegador no soporta una versión estable de indexedDB. " +
                   " Tal y como las características no serán validas. Recomendación: Chrome," + 
                   " FireFox u Opera para una mejor experiencia");
    }


  }
  public dataListDB: any = [];
  createDBSERIAL() {
    var db;
    const dataBDNames =  indexedDB.open('List-Database', 2);
    dataBDNames.onsuccess = () => {
      db = dataBDNames.result;
      const transaction = db.transaction(['List-Database'], 'readwrite');
      const objectStore = transaction.objectStore('List-Database');   
      objectStore.add(this.dataListDB);
    }
  }

  createDB(database, data, b) {

    localStorage.setItem('bd', database);
    var db;
    let a = document.getElementById(b);
    const DBopen = indexedDB.open(database, 1)

    DBopen.onerror = function(event) {
      // Hacer algo con request.errorCode!
      //alert('Algo ha sucedido no se ha podido completar la creación de la base de datos / ' + event.target)
      a.innerText = 'Algo ha ocurrido';
      a.style.color = 'red';
    };

    DBopen.onsuccess = function(event) {
      // Hacer algo con request.result!
      //alert('La base de datos ha sido creada');
      db = DBopen.result;
      const transaction = db.transaction([database], 'readwrite');
      const objectStore = transaction.objectStore(database);    

      a.innerText = 'Create Success';
      a.style.color = 'green';

      Swal.fire(
        'Bien!',
        'Base de datos creada ' + database,
        'success'
      )

    };

    DBopen.onupgradeneeded = function(event) {
      db = DBopen.result;
      
      // Crea un almacén de objetos (objectStore) para esta base de datos
      var objectStore = db.createObjectStore(database, {
                  //autoIncrement: true,
                  keyPath: 'Codigo'
      });

    };

  }  

  agregarData(database, a, b ,c) {

    this.dataTests = {
      Nombre: a,
      Codigo: b,
      Anio:   c
    }
    
    database = localStorage.getItem('bd');
    //console.log(this.dataTests);
    var db;
    const DBopen = indexedDB.open(database, 1);

    DBopen.onsuccess = () => {

      

      db = DBopen.result;
      var transaction = db.transaction([database], 'readwrite');
      var objectStore = transaction.objectStore(database);
      objectStore.add(this.dataTests);

    }

  // this.readDB();
    this.loadpage();
  }

  loadpage() {
    window.location.reload();
  }

  elData(database) {
    
    var db;
    const DBopen = indexedDB.open(database, 1);
    
    DBopen.onsuccess = () => {
      
      db = DBopen.result;
      var transaction = db.transaction([database], 'readwrite');
      var objectStore = transaction.objectStore(database);
      objectStore.delete(1);

    }

  }

  elBDData(database) {
   
    database = localStorage.getItem('bd');

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your DB has been deleted.',
          'success'
          )
        }
        // console.log(localStorage.getItem('bd'));
        const Dbdelete = indexedDB.deleteDatabase(localStorage.getItem('bd'));
    })

  }
  public arrCursor: any = [];
  public bdArr;

  public name;
  public codec;
  public anio;
  readDB() {

    

    let database = localStorage.getItem('bd');
    var db;
    const DBopen = indexedDB.open(database, 1)
    DBopen.onsuccess = (e) => {
      db = DBopen.result;
      var transaction = db.transaction([database], 'readonly');
      var objectStore = transaction.objectStore(database);
      objectStore.openCursor().onsuccess = (e) => {
       
        const cursor = e.target.result;

        if( cursor ) {
          
          this.arrCursor.push(cursor.value);
          cursor.continue();   
          console.log(this.arrCursor);
          
        }

        else{
          console.log('Ya se han desplegado todos los datos')
        }
        
      }

    }

  }



}
