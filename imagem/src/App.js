import React, { useState, useEffect } from 'react';
import './App.css'; // Arquivo CSS para estilização

function App() {
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);

  // Função para buscar imagens ao carregar a página
  useEffect(() => {
    fetchImages();
  }, []);

  // Função para buscar todas as imagens
  const fetchImages = async () => {
    try {
      const response = await fetch('/cliente/');
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      } else {
        console.error('Erro ao buscar imagens:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar imagens:', error.message);
    }
  };

  // Função para converter a imagem para base64 ao selecioná-la
  const convert2base64 = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result.toString());
    };

    reader.readAsDataURL(file);
  };

  // Função para enviar a imagem para o backend ao clicar em "Armazenar Imagem"
  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('imagem', image);

      const response = await fetch('/cliente/create', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Imagem armazenada com sucesso!');
        await fetchImages();
        setImage('');
      } else {
        console.error('Erro ao armazenar imagem:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao armazenar imagem:', error.message);
    }
  };

  // Função para deletar uma imagem
  const deleteImage = async id => {
    try {
      const response = await fetch(`/cliente/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Imagem deletada com sucesso!');
        await fetchImages();
      } else {
        console.error('Erro ao deletar imagem:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao deletar imagem:', error.message);
    }
  };

  return (
    <div className="app">
      <h1>Upload de Imagem</h1>
      <div>
        {images.map(img => (
          <div key={img.id}>
            <img src={img.url} alt="Imagem" />
            <button onClick={() => deleteImage(img.id)}>Deletar</button>
          </div>
        ))}
      </div>
      <input id="fileupload" className="hidden" type="file" onChange={e => convert2base64(e)} />
      <label htmlFor="fileupload">Upload de Imagem</label>
      <button onClick={uploadImage}>Armazenar Imagem</button>
    </div>
  );
}

export default App;
