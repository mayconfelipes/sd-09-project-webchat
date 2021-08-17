/* A view é responsável por receber as informações do
model (via controller) e exibi-las para o usuário, ou seja:
se comunica com o controller (recebe o que deve exibir e
comunica eventos à medida que o usuario interage com a aplicacao;
e com o model (recebe os dados que deve mostrar).

Uma template engine permite a criação de HTML de forma dinâmica.
Permite inserir trechos de código dentro de um arquivo. A engine
então é capaz de reconhecer e executar esses códigos embutidos e
de substituir o que for retornado por esse código no arquivo,
criando assim um documento dinâmico. //  npm install ejs

TAGS EJS
<% "Scriptlet" tag, for control-flow, no output
<%_ ‘Whitespace Slurping’ Scriptlet tag, strips all whitespace before it
<%= Outputs the value into the template (HTML escaped)
<%- Outputs the unescaped value into the template
<%# Comment tag, no execution, no output
<%% Outputs a literal "<%"
%> Plain ending tag
-%> Trim-mode ("newline slurp") tag, trims following newline
_%> ‘Whitespace Slurping’ ending tag, removes all whitespace after it */