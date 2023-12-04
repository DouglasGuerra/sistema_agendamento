const { localsName } = require("ejs");
let conn = require("../db/db");
let express = require("express");
let app =  express();
module.exports ={

    inserindoAgendamentoDeConsulta(req, res){

        conn.query(`INSERT INTO consultas(nome,email,horario,numero,profissional,estado)values('${req.body.nome_completo}','${req.body.email}','${req.body.horario_consulta}','${req.body.whatsapp}','${req.body.profissional}','${req.body.estado}')`, (erro, sucesso)=>{
        
            if(erro){
                 console.log(`Erro=>${erro}`)   
            }
            
            res.render("agendamento_paciente", {
                title: "Agendamento",
                message: "Agendamento concluido"
            });

            console.log("OI")


    });

},


    mostrandoDadosDoAgendamentoDeConsulta(req, res){

        conn.query("select * from consultas", (erro, dados)=>{

            if(erro){
                console.log(erro)
            }

            res.render("todas_as_consultas", {
                title: "Consultas",
                dados,
                
            })
        

        });

    },

        MostrandoComentariosPacientes(req, res){

        


        },

        RecuperandoDadosGraficos(req, res){
            conn.query("SELECT (SELECT COUNT(*) FROM consultas) AS nconsultas, (SELECT COUNT(*) FROM COMENTARIOS) AS ncomentarios;", (error, dados)=>{

                error ? console.log(`Erro=>${error}`) : console.log(`tudo ok na rota`) ;
                console.log(dados)
        
                   res.render('index-admin.ejs',{
                    title: "Dashboard",
                    dados,
        
                   });
        
           });
        }


}