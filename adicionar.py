desafiosNaoAlcool = [
"Abra o spotted e mande pra alguém",
"Grave um vídeo da festa e poste nos stories",
"Traga dois pés de meia diferentes entre si",
"Tire uma foto da sua garganta e mande para alguém",
"Comente corações em uma foto antiga da última pessoa que te seguiu no Instagram ",
"Puxe a pessoa atrás de você para dançar uma música",
"Finja um amasso na parede",
"Se declare para a pessoa do seu lado",
"Pergunte seu futuro para alguem da organização (não vale gente do bar dos desafios)",
"Fazer uma “OLA” com mais 5 amigos",
"Tire uma foto com pelo menos 1 pessoa da organização (não vale gente do bar dos desafios)",
"Troque seu sapato com alguem",
"Fale para alguem da organizacao que vai ficar tudo bem",
"Equilibre um copo na cabeça por 3 segundos",
"Encontre 3 chinelos diferentes",
"Cante evidências com outra pessoa ",
"Peça pra alguem mandar a foto da orelha ",
"Faça uma massagem em alguém do lado",
"Pinte sua cara de tinta",
"Tire uma foto com alguém desconhecido ",
"Troque de tirante com alguém do role ",
"Ache alguém que tenha um ingresso da festa de 10 anos da CEM",
"Fale a ordem das músicas da Comp",
]

desafiosAlcool = [
"Beba com alguém com a mesma cor de pulseira neon",
"Beba com alguém com pulseira de cor diferente neon ",
"Deite a cabeça no balcão olhando para cima e tome um shot assim",
"Tome um shot de cabeça para baixo",
"Beba um shot com alguém da organização",
"Vire a sua caneca na boca de alguém enquanto ela vira a dela na sua",
"Jogue pedra, papel, tesoura até ganhar 2 vezes. Para cada derrota, beba um shot",
"Diga uma cantada para a pessoa do bar até que ela aprove. Beba um shot para cada cantada não aprovada",
"Tome o que esta na caneca da pessoa ao lado",
"Se você está de sapatênis, beba 6 shots. Senão tome apenas 1",
"Diga o que significam as 7 primeiras letras da sigla LGBTQIA+, e beba 1 shot para cada letra não correta",
"Vira seu copo ou tome 2 shots de cachaça",
"Escolha alguém desconhecido e fale \"mim dê papai\" pra derramar bebida na sua boca",
"Peça/dê um trote",
"Encontre 1 atletas CEM pra tomar um shot com vc",
"Tome um shot com alguém da conpec",
"Imite algum esporte ofertado pela CEM ou tome um shot",
"Mostre a última foto da sua galeria pra alguém da organização",
]

desafiosPega = [
"Beije alguém de calça jeans",
"Beije alguém da pós-graduação",
"Beije alguém com a mesma cor de pulseira",
"Beije alguém com a roupa da mesma cor que a sua",
"Beije alguém com cor diferente de pulseira",
"Beije alguém trabalhando (incluindo pessoas do bar do desafio)",
"Dê um beijo triplo",
"Beije alguém de colete",
"Beije alguém da comp ",
"Beije alguém que não seja da comp ",
"Dê uma cantada, se a pessoa gostar beija senão toma um shot ",
"Pegue alguém do sudeste ",
"Pegue alguém do nordeste",
"Pegue alguém do norte",
"Pegue alguém do centro-oeste ",
"Pegue alguém do sul",
"Pegue alguém de fora do Brasil",
"Beije alguém de chinelo (crocs é mais hype)",
"Beije alguém pintado ",
"Beije algum membro da gestão CEM atual",
"Beije alguém da conpec",
"Beije algum diretor da AAACEC",
"Beije algum ex seu",
"Beije alguém que já participou de um Intercomp",
"Beije alguém com piercing",
"Beije o presidente da AAACEC",
]

import requests

token = "seu_token_aqui"  # Substitua pelo token de autenticação

url = "https://festa.aaacec.com/api/v1/challenge"

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

party_id = "025saologin"  # ID da festa

for id, desafio in enumerate(desafiosNaoAlcool):
    data = {
        "description": desafio,
        "points": 1,
        "tags": [],
        "partyId": party_id,
        "numericId": id+1
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        print(f"Desafio '{desafio}' criado com sucesso!")
    else:
        print(f"Falha ao criar desafio '{desafio}': {response.status_code} - {response.text}")

for id, desafio in enumerate(desafiosAlcool):
    data = {
        "description": desafio,
        "points": 1,
        "tags": ["alcoolico"],
        "partyId": party_id,
        "numericId": id+1+len(desafiosAlcool)
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        print(f"Desafio '{desafio}' criado com sucesso!")
    else:
        print(f"Falha ao criar desafio '{desafio}': {response.status_code} - {response.text}")

for id, desafio in enumerate(desafiosPega):
    data = {
        "description": desafio,
        "points": 1,
        "tags": ["pegacao"],
        "partyId": party_id,
        "numericId": id+1+len(desafiosAlcool)+len(desafiosNaoAlcool)
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        print(f"Desafio '{desafio}' criado com sucesso!")
    else:
        print(f"Falha ao criar desafio '{desafio}': {response.status_code} - {response.text}")
