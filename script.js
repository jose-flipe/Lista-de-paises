function listarPaises(continente = 'all') {
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(paises => {
            const listaPaises = document.getElementById('listaPaises');
            listaPaises.innerHTML = '';

            const paisesFiltrados = paises.filter(pais => continente === 'all' || pais.region === continente);

            const paisesAleatorios = paisesFiltrados.sort(() => Math.random() - 0.5).slice(0, 10);

            paisesAleatorios.forEach(pais => {
                const li = document.createElement('li');
                li.textContent = pais.name.common;

                const botaoFavoritar = document.createElement('button');
                botaoFavoritar.textContent = 'Favoritar';
                botaoFavoritar.onclick = () => favoritarPais(pais);
                li.onclick = () => mostrarDetalhesPais(pais.name.common);

                li.append(botaoFavoritar);
                listaPaises.appendChild(li);
            });

            if (paisesAleatorios.length === 0) {
                listaPaises.innerHTML = '<li>Nenhum país encontrado nesse continente.</li>';
            }
        })
        .catch(error => {
            console.error('Erro ao listar países:', error);
        });
}

function mostrarDetalhesPais(paisNome) {
    fetch(`https://restcountries.com/v3.1/name/${paisNome}`)
        .then(response => response.json())
        .then(pais => {
            const { name, capital, population, region, flags } = pais[0];
            document.getElementById('nomePais').textContent = name.common;
            document.getElementById('capitalPais').textContent = capital ? capital[0] : 'N/A';
            document.getElementById('populacaoPais').textContent = population.toLocaleString('pt-BR');
            document.getElementById('regiaoPais').textContent = region;
            document.getElementById('bandeiraPais').src = flags.png;
        })
        .catch(error => {
            console.error('Erro ao mostrar detalhes do país:', error);
        });
}

function favoritarPais(pais) {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    if (!favoritos.some(favorito => favorito.name.common === pais.name.common)) {
        favoritos.push(pais);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        atualizarListaFavoritos();
    } else {
        alert('Esse país já está nos favoritos.');
    }
}

function atualizarListaFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    const listaFavoritos = document.getElementById('listaFavoritos');
    listaFavoritos.innerHTML = '';

    favoritos.forEach(pais => {
        const li = document.createElement('li');
        li.textContent = pais.name.common;

        const botaoRemover = document.createElement('button');
        botaoRemover.textContent = 'Remover';
        botaoRemover.onclick = () => removerFavorito(pais);

        li.appendChild(botaoRemover);
        listaFavoritos.appendChild(li);
    });
}

function removerFavorito(pais) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    favoritos = favoritos.filter(favorito => favorito.name.common !== pais.name.common);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    atualizarListaFavoritos();
}

document.getElementById('continenteSelect').addEventListener('change', (event) => {
    const continenteSelecionado = event.target.value;
    listarPaises(continenteSelecionado);
});

listarPaises();
atualizarListaFavoritos();