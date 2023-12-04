const express = require('express');
const app = express();
const conn = require("./db/db");
const path = require('path');
const nodemailer = require("nodemailer");
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const include_functions = require("./functions/include_functions");
app.set(express.static(path.join(__dirname + "/public")));

//principal admin
app.get("/", (req, res, next)=>{

    res.render("agendamento_paciente.ejs", {
        title: "Sistema",
        message: " ",
    })

});

app.get("/dadosindb04122023", (req, res)=>{

    include_functions.RecuperandoDadosGraficos(req, res);

});

app.get("/login", (req, res)=>{

    res.render("login.ejs", {
        title:"login",
        message:" ",
        
    })

});

app.post("/login", (req, res)=>{

        conn.query("select * from usuario_admin", (erro, acess)=>{

            if(erro){
                console.log(erro)
            }
            acess.forEach(e=>{
             
                switch(e.id){
                    case 1:
                        if(req.body.user == e.user && req.body.password == e.password){
                           res.redirect("http://localhost:8080/dashboard");
                        }
                    break;
    
                    case 2:
                        if(req.body.user == e.user && req.body.password == e.password){
                            res.redirect("http://localhost:8080/dashboard");
                        }
                    break;
                    
                    
                }
    
            
            });//foreach
    
                    if(req.body.user !== acess.user && req.body.password !== acess.password){
                        res.render("login", {
                            message: "Usuário ou senha incorreto",
                            title: "Login",
    
                        })
                    }// closed if
                            
     }); 
    


});

app.get("/dashboard", (req, res)=>{

    include_functions.RecuperandoDadosGraficos(req, res)


});


//paciente começa aqui
app.get("/comentarios_paciente", (req, res)=>{

    conn.query("select * from comentarios ", (erro, comentario)=>{

        erro ? console.log(erro) : console.log("está tudo ok");

        res.render("inc/comentarios_paciente", {
                    title:"OI",
                    comentario,
                    
        });

    });

})


app.get("/todas_as_consultas", (req, res, next)=>{

    include_functions.mostrandoDadosDoAgendamentoDeConsulta(req, res)
});

app.get("/:id/:nome/:email/:horario/:numero/:profissional/:estado", (req, res, next)=>{

        res.render("inc/modelo_paciente.ejs",{
            id: req.params.id,
            nome: req.params.nome,
            email: req.params.email,
            horario: req.params.horario,
            numero: req.params.numero,
            profissional: req.params.profissional,
            estado:req.params.estado,
            title: "Paciente",
        });

});

app.get("/observacoes_paciente/:id/:nome/:email/:horario/:numero/:profissional/:estado", (req, res, next)=>{

    conn.query(`select * from comentarios WHERE nome_paciente='${req.params.nome}'`, (erro, dados)=>{

        erro ? console.log(`Erro=>${erro}`) : console.log("Tudo ok");

            console.log(req.params.nome)
            res.render("inc/observacoes_paciente.ejs",{
                id: req.params.id,
                nome: req.params.nome,
                email: req.params.email,
                horario: req.params.horario,
                numero: req.params.numero,
                profissional: req.params.profissional,
                estado:req.params.estado,
                title: "Paciente",
                dados,
            })



    });



});

app.get("/anexos_paciente/:id/:nome/:email/:horario/:numero/:profissional/:estado", (req, res, next)=>{

    res.render("inc/anexos_paciente.ejs",{
        id: req.params.id,
        nome: req.params.nome,
        email: req.params.email,
        horario: req.params.horario,
        numero: req.params.numero,
        profissional: req.params.profissional,
        estado:req.params.estado,
        title: "Paciente",
    })

});

app.get("/prontuario_paciente/:id/:nome/:email/:horario/:numero/:profissional/:estado", (req, res, next)=>{

    res.render("inc/prontuario_paciente.ejs",{
        id: req.params.id,
        nome: req.params.nome,
        email: req.params.email,
        horario: req.params.horario,
        numero: req.params.numero,
        profissional: req.params.profissional,
        estado:req.params.estado,
        title: "Paciente",
    })

});

app.post("/cadastrando_banco_paciente", (req, res)=>{

    conn.query(`INSERT INTO prontuario (nome_prontuario, data_de_nascimento_prontuario, sexo_prontuario, endereco_prontuario, telefone_prontuario, contato_emergencia_prontuario)value(?,?,?,?,?,?) `,[
            req.body.nome_pronturario,
            req.body.data_pronturario,
            req.body.sexo_pronturario,
            req.body.endereco_pronturario,
            req.body.telefone_pronturario,
            req.body.contato_emergencia_pronturario
     ], (erro, sucesso)=>{
         erro ? console.log(`Erro=>${erro}`) : console.log("Deu certo!");

        res.redirect('back')
        
    })


})

app.put("/atualizando/:id", (req, res)=>{
    
       console.log(req.params.id)

});



app.post("/comentario_do_paciente/", (req ,res)=>{
    
    conn.query(`INSERT INTO comentarios(nome_psicologo,nome_paciente,comentario)values('${req.body.nome_psicologo}','${req.body.nome_paciente}','${req.body.comentario_psicologo}')`, (erro)=>{
        
        if(erro){
             console.log(`Erro=>${erro}`)   
        }
        res.redirect("http://localhost:8080/todas_as_consultas");
        
});

})

app.get("/agendamento_paciente", (req, res, next)=>{

    res.render("agendamento_paciente", {
        title: "Agendamento",
        message: " ",
    })

});

app.post("/agendamento_paciente", (req, res, next)=>{
    include_functions.inserindoAgendamentoDeConsulta(req, res);

    let user = 'contato@agendamento.abracepsicologia.com.br';
    let password = 'Teste123';

    const transporter =  nodemailer.createTransport({
        host:'smtp.hostinger.com',
        port: 993,
        auth: {user, password}
    });


    transporter.sendMail({
        from: user,
        to : user,
        replyTo: 'douglas.guerra@dcweb.com.br',
        subject: 'Olá, esse email é de teste',
        text: 'Conteudo do email'

        }).then(sucesso=>{
            res.send(sucesso)
        }).catch(e=>{
            console.log(e);
        })

});





app.get("/agendamento_psicologo", (req, res, next)=>{

    res.render("agendamento_psicologo", {
        title: "Sistema",
    })

});



app.listen(8080, ()=>{
    console.log("server rodando!");

})