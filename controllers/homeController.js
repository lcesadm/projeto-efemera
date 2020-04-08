const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const {check, validationResult, body} = require('express-validator')

const homeController = {
  index: (req, res) => {
    let servicos = [
      {nome: 'Dev full stack', imagem: '/imagens/undraw_dev_focus.svg'},
      {nome: 'Consultoria UX', imagem: '/imagens/undraw_mobile_apps.svg'},
      {nome: 'Marketing Digital', imagem: '/imagens/undraw_social_dashboard.svg'},
      {nome: 'Suporte tecnico', imagem: '/imagens/undraw_dev_focus.svg'},
      {nome: 'Data Science', imagem: '/imagens/undraw_mobile_apps.svg'},
    ];

    let banners = [
      '/imagens/banner2.jpg',
      '/imagens/banner3.jpg',
      '/imagens/banner4.jpg',
      '/imagens/banner.jpg',
    ];

    res.render('index', { title: 'Home', listaServicos: servicos, listaBanners: banners });
  },
  contato: (req,res) => {

    let {nome, email, mensagem} =  req.body;
    // novo conteudo
    let infoContato = { nome, email, mensagem };
    // caminho e nome do arquivo
    let fileContato = path.join('db', 'contatos.json');
    
    let listaContato = [];

    if (fs.existsSync(fileContato)){
      // trazer informações do arquivo
      listaContato = fs.readFileSync(fileContato, {encoding: 'utf-8'});
      listaContato = JSON.parse(listaContato);
    }
    
    //cria um array com uma posição
    listaContato.push(infoContato);
    //converter conteudo para json
    listaContato = JSON.stringify(listaContato);
    //salva informações no arquivo
    fs.writeFileSync(fileContato, listaContato);

    res.render('contato', {nome, email, title: 'Contato'});

  },
  newsletter: (req, res) => {
    let {email} = req.query;

    const fileNewsletter = path.join("db", "newsletter.json");

    let listaNewsletter = [];

    if (fs.existsSync(fileNewsletter)) {
      listaNewsletter = fs.readFileSync(fileNewsletter, {encoding: "utf-8"});
      listaNewsletter = JSON.parse(listaNewsletter);
    }
    
    listaNewsletter.push({email, timestamp: new Date()});
    listaNewsletter = JSON.stringify(listaNewsletter);
    fs.writeFileSync(fileNewsletter, listaNewsletter);


    res.render('newsletter', {email, title: 'Newsletter'});
  },


  pagCadastro : (req, res) => {
    res.render('cadastro', {title:"Cadastro"});
  },
  cadastrarUsuario : (req, res) => {

    let listaErrors = validationResult(req);

    if(listaErrors.isEmpty()){

      let {nome, email, senha} = req.body;
      let {files} = req;
      let senhaC = bcrypt.hashSync(senha,10);

      let dadosUsuarios = {nome, email, senha:senhaC, avatar:files[0].originalname};
      let usuarios = [];

      let caminho = path.join('db', 'usuarios.json');
      
      if(fs.existsSync(caminho)){
        usuarios = fs.readFileSync(caminho, {encoding : 'utf-8'} );
        usuarios = JSON.parse(usuarios);
      }
      
      

      usuarios.push(dadosUsuarios);
      usuarios = JSON.stringify(usuarios);
      
      fs.writeFileSync(caminho, usuarios);

      res.render('login',{title: "Login usuario"})
    }else{
      return res.render('cadastro',{title:"Cadastro", errors: listaErrors.errors})
    }     
  },

  
  pagLogin : (req, res) => {
    res.render('login', { title:"Login" });
  },
  login : (req, res) => {

    let {email, senha} = req.body;
    let caminho = path.join('db', 'usuarios.json');

   
    let usuariosSalvos = fs.readFileSync( caminho,{encoding: 'utf-8'});
    usuariosSalvos = JSON.parse(usuariosSalvos)
    
    let dadosUsuario =[] ;

    for( let usuario of usuariosSalvos){
        if(usuario.email == email){
            dadosUsuario.push(usuario)          
        }                      
    }

    if(dadosUsuario == ""){    
      return res.send('E-mail invalido')      
    }
      
      
    if(!bcrypt.compareSync(senha, dadosUsuario[0].senha)){     
      return res.send('Senha invalida') 
    }
  
    req.session.usuario = dadosUsuario[0];
    
    res.redirect('admin')
  }

};

module.exports = homeController;
