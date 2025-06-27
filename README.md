# Monitor SEFAZ Brasil - Documentação

## Visão Geral
O Monitor SEFAZ Brasil é um sistema de monitoramento em tempo real dos servidores SEFAZ de todos os estados do Brasil. O sistema apresenta o status dos serviços através de um mapa visual interativo e indicadores em tempo real.

## Funcionalidades Implementadas

### 1. Painel de Indicadores Gerais
- **Serviços Online**: Contador de serviços funcionando normalmente
- **Serviços Offline**: Contador de serviços indisponíveis
- **Em Contingência**: Contador de serviços em modo de contingência
- **Total de Serviços**: Contador total de serviços monitorados

### 2. Mapa Visual do Brasil
- Mapa real do Brasil com marcadores coloridos para cada estado
- **Verde**: Todos os serviços do estado estão online
- **Vermelho**: Autorização offline ou todos os serviços offline
- **Amarelo**: Algum outro serviço offline
- **Azul**: Estado está em contingência (conforme lista da SEFAZ/RS)
- Marcadores interativos com hover e clique

### 3. Lista de Estados
- Grid responsivo com cards para cada estado
- Informações de status e quantidade de serviços online
- Cards coloridos conforme o status geral do estado
- Clique para ver detalhes dos serviços

### 4. Modal de Detalhes
- Exibe informações detalhadas de cada estado
- Lista todos os serviços SEFAZ monitorados
- Status individual de cada serviço (Online/Offline)
- Interface limpa e intuitiva

### 5. Atualização Automática
- Sistema atualiza automaticamente a cada 30 segundos
- Consulta real dos serviços SEFAZ
- Timestamp da última atualização

## Serviços Monitorados
- Autorização NFe
- Retorno Autorização NFe
- Inutilização NFe
- Consulta Protocolo NFe
- Status Serviço NFe
- Consulta Cadastro
- Recepção Evento NFe
- NFCe Autorização
- NFCe Consulta

## Consulta de Serviços
Cada UF possui um domínio específico para os webservices da NFe. A maioria segue
o formato `https://nfe.sefaz.{UF}.gov.br/ws`, mas alguns estados utilizam
endereços diferentes (por exemplo, São Paulo usa `https://nfe.fazenda.sp.gov.br/ws`).

Todos esses domínios estão mapeados no objeto `SEFAZ_BASE_URLS` presente em
`script.js`. Se alguma UF alterar seu endereço, basta atualizar esse objeto.

## Estados em Contingência
A lista de UFs em contingência é obtida dinamicamente da página oficial da SEFAZ/RS
(<https://www.sefaz.rs.gov.br/NFE/NFE-SVC.aspx>). O sistema realiza uma requisição
e verifica cada linha da tabela. Caso a coluna de situação contenha `Desativado`
ou `Desativada`, a UF não é considerada em contingência. Qualquer outro valor
indica que a contingência está ativa para aquele estado.

## Tecnologias Utilizadas
- **HTML5**: Estrutura da aplicação
- **CSS3**: Estilização e responsividade
- **JavaScript**: Lógica de negócio e interatividade
- **Font Awesome**: Ícones
- **Fetch API**: Consulta de disponibilidade diretamente nos serviços SEFAZ e
  leitura da lista de contingência diretamente do site oficial

## Estrutura do Projeto
```
monitor-sefaz-html/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript
├── brazil-map.png      # Imagem do mapa do Brasil
└── README.md           # Esta documentação
```

## Como Executar
1. Navegue até o diretório do projeto
2. Execute um servidor HTTP local:
   ```bash
   python3 -m http.server 8081
   ```
3. Acesse http://localhost:8081 no navegador

## Características Técnicas
- **Responsivo**: Funciona em desktop e mobile
- **Performance**: Atualização eficiente sem recarregar a página
- **Acessibilidade**: Tooltips e navegação por teclado
- **Modular**: Código organizado e fácil de manter

## Possíveis Melhorias Futuras
- Integração com APIs reais da SEFAZ
- Histórico de disponibilidade
- Notificações por email/SMS
- Exportação de relatórios
- Autenticação de usuários
- Configuração de intervalos de atualização

