import React from 'react';
import './About.css'; // Stil dosyası / Style file

function About() {
  return (
    <div className="about-container">
      {/* Üst Bilgi Kısmı / Header Section */}
      <div className="about-header">
        <h2><i className="fa-solid fa-circle-info"></i> Hakkımızda</h2>
        <p>Tarsus Belediyesi Akıllı Şehir ve Bildirim Yönetim Sistemi</p>
      </div>

      {/* İçerik Kartları / Content Cards */}
      <div className="about-content">
        
        {/* Vizyon Kartı / Vision Card */}
        <div className="about-card">
          <div className="card-icon">
            <i className="fa-solid fa-bullseye"></i>
          </div>
          <h3>Vizyonumuz</h3>
          <p>
            Tarsus'u daha yaşanabilir, modern ve akıllı bir şehir haline getirmek için 
            teknolojinin gücünü kullanıyoruz. Vatandaşlarımızın bildirdiği sorunlara 
            en hızlı şekilde müdahale etmek temel önceliğimizdir.
          </p>
        </div>

        {/* Misyon Kartı / Mission Card */}
        <div className="about-card">
          <div className="card-icon">
            <i className="fa-solid fa-handshake"></i>
          </div>
          <h3>Amacımız</h3>
          <p>
            Belediye ile vatandaş arasındaki iletişimi güçlendirmek, Bildirim ve 
            talepleri şeffaf bir şekilde yöneterek Tarsus halkına yenilikçi ve 
            kesintisiz bir hizmet sunmaktır.
          </p>
        </div>

        {/* Proje Bilgi Kartı / Project Info Card */}
        <div className="about-card">
          <div className="card-icon">
            <i className="fa-solid fa-laptop-code"></i>
          </div>
          <h3>Proje Hakkında</h3>
          <p>
            Bu platform, üniversite projesi kapsamında geliştirilmiş modern bir 
            web uygulamasıdır. Hızlı ve güvenilir bir altyapı sunmak amacıyla 
            React ve .NET Core teknolojileri kullanılarak tasarlanmıştır.
          </p>
        </div>

      </div>
    </div>
  );
}

export default About;