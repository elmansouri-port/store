(function () {
  'use strict';

  var icons = {
    'video-camera': '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"/>',
    'chat': '<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/>',
    'calendar': '<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>',
    'chart-bar': '<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>',
    'phone': '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>',
    'lock-closed': '<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>',
    'newspaper': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125c-.621 0-1.125.504-1.125 1.125v13.5c0 .621.504 1.125 1.125 1.125h12.75"/>',
    'academic-cap': '<path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"/>',
    'book-open': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/>',
    'users': '<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>',
    'lifebuoy': '<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Zm0 0v4.5m-6.375-9.75 3.185 3.185m0 0 3.185-3.185M12 12l3.185 3.185M12 12l-3.185-3.185"/>',
    'sparkles': '<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"/>',
    'question-mark-circle': '<path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"/>',
    'light-bulb': '<path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/>'
  };

  function svgIcon(name) {
    var p = icons[name] || icons['chat'];
    return '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">' + p + '</svg>';
  }

  function makeItem(href, icon, title, desc) {
    return [
      '<a href="' + href + '" class="mega-menu-item" role="menuitem">',
        '<span class="mega-menu-item-icon">' + svgIcon(icon) + '</span>',
        '<span class="mega-menu-item-text">',
          '<p class="mega-menu-item-title">' + title + '</p>',
          '<p class="mega-menu-item-desc">' + desc + '</p>',
        '</span>',
      '</a>'
    ].join('');
  }

  function makeMobileItem(href, icon, title, desc) {
    return [
      '<a href="' + href + '" class="mega-menu-mobile-item">',
        '<span class="mega-menu-mobile-item-icon">' + svgIcon(icon) + '</span>',
        '<span class="mega-menu-mobile-item-text"><p class="mega-menu-mobile-item-title">' + title + '</p><p class="mega-menu-mobile-item-desc">' + desc + '</p></span>',
      '</a>'
    ].join('');
  }

  var productsItems = [
    makeItem('/products/webinar', 'video-camera', 'Rainbow Webinar', 'Webinaires live et en replay avec outils d\'engagement intégrés.'),
    makeItem('/products/collaboration', 'chat', 'Rainbow Collaboration', 'Messagerie d\'équipe, canaux et partage de fichiers en un seul endroit.'),
    makeItem('/products/smart-hotel', 'calendar', 'Rainbow Smart Hotel', 'Réservation de salles et gestion de calendrier pour les hôtels.'),
    makeItem('/products/analytics', 'chart-bar', 'Rainbow Analytics', 'Rapports en temps réel et analyses de vos données de communication.'),
    makeItem('/products/voice', 'phone', 'Rainbow Voice', 'Téléphonie cloud avec voix HD, SVI et routage d\'appels.'),
    makeItem('/products/security', 'lock-closed', 'Rainbow Security', 'Chiffrement de niveau entreprise et contrôles de conformité.')
  ].join('');

  var productsHTML = [
    '<div class="mega-menu" role="menu">',
      '<div class="mega-menu-inner">',
        '<div class="mega-menu-main">',
          '<p class="mega-menu-section-title">Nos produits</p>',
          '<div class="mega-menu-grid">' + productsItems + '</div>',
          '<a href="/products" class="mega-menu-see-all">Voir tous les produits <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></a>',
        '</div>',
        '<div class="mega-menu-side">',
          '<p class="mega-menu-section-title">À la une</p>',
          '<a href="/products/webinar" class="mega-menu-showcase">',
            '<div class="mega-menu-showcase-img">' + svgIcon('video-camera') + '</div>',
            '<div class="mega-menu-showcase-body">',
              '<p class="mega-menu-showcase-title">Rainbow Webinar</p>',
              '<p class="mega-menu-showcase-desc">Engagez votre audience avec des webinaires interactifs en direct et en replay.</p>',
              '<span class="mega-menu-showcase-tag">Nouveau</span>',
            '</div>',
          '</a>',
          '<p class="mega-menu-section-title">Intégrations</p>',
          '<a href="/integrations" class="mega-menu-side-cta">',
            '<span class="mega-menu-side-cta-icon">' + svgIcon('calendar') + '</span>',
            '<span><p class="mega-menu-side-cta-text">Connectez vos outils</p><p class="mega-menu-side-cta-desc">Google, Outlook, Teams &amp; plus</p></span>',
          '</a>',
        '</div>',
      '</div>',
      '<div class="mega-menu-footer">',
        '<p class="mega-menu-footer-text">Besoin d\'aide pour choisir ? Nous sommes là pour vous guider.</p>',
        '<div class="mega-menu-footer-actions">',
          '<a href="/Démo" class="mega-menu-btn mega-menu-btn-secondary">' + svgIcon('question-mark-circle') + 'Réserver une démo</a>',
          '<a href="/contact" class="mega-menu-btn mega-menu-btn-primary">' + svgIcon('lifebuoy') + 'Nous contacter</a>',
        '</div>',
      '</div>',
    '</div>'
  ].join('');

  var ressourcesItems = [
    makeItem('/blog', 'newspaper', 'Blog', 'Actualités, conseils et mises à jour produit de l\'équipe Rainbow.'),
    makeItem('/tutorials', 'academic-cap', 'Tutoriels', 'Guides pas-à-pas et vidéos pour tirer le meilleur de Rainbow.'),
    makeItem('/docs', 'book-open', 'Documentation', 'Docs API complètes, guides d\'intégration et références techniques.'),
    makeItem('/community', 'users', 'Communauté', 'Rejoignez la communauté Rainbow pour partager vos idées et obtenir de l\'aide.'),
    makeItem('/support', 'lifebuoy', 'Support', 'Obtenez de l\'aide technique, signalez des problèmes et trouvez des solutions.'),
    makeItem('/changelog', 'sparkles', 'Nouveautés', 'Restez informé des dernières fonctionnalités, versions et améliorations.')
  ].join('');

  var ressourcesHTML = [
    '<div class="mega-menu" role="menu">',
      '<div class="mega-menu-inner">',
        '<div class="mega-menu-main">',
          '<p class="mega-menu-section-title">Apprendre &amp; Découvrir</p>',
          '<div class="mega-menu-grid">' + ressourcesItems + '</div>',
          '<a href="/ressources" class="mega-menu-see-all">Parcourir toutes les ressources <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></a>',
        '</div>',
        '<div class="mega-menu-side">',
          '<p class="mega-menu-section-title">Guide populaire</p>',
          '<a href="/tutorials" class="mega-menu-showcase">',
            '<div class="mega-menu-showcase-img">' + svgIcon('light-bulb') + '</div>',
            '<div class="mega-menu-showcase-body">',
              '<p class="mega-menu-showcase-title">Débuter avec Rainbow</p>',
              '<p class="mega-menu-showcase-desc">Tout ce qu\'il faut savoir pour configurer et commencer à utiliser Rainbow en 10 minutes.</p>',
              '<span class="mega-menu-showcase-tag">Populaire</span>',
            '</div>',
          '</a>',
          '<p class="mega-menu-section-title">Besoin d\'aide ?</p>',
          '<a href="/support" class="mega-menu-side-cta">',
            '<span class="mega-menu-side-cta-icon">' + svgIcon('lifebuoy') + '</span>',
            '<span><p class="mega-menu-side-cta-text">Accéder au centre d\'aide</p><p class="mega-menu-side-cta-desc">Disponible 24h/7j pour vous aider</p></span>',
          '</a>',
        '</div>',
      '</div>',
      '<div class="mega-menu-footer">',
        '<p class="mega-menu-footer-text">Restez informé des dernières nouveautés Rainbow.</p>',
        '<div class="mega-menu-footer-actions">',
          '<a href="/blog" class="mega-menu-btn mega-menu-btn-secondary">' + svgIcon('newspaper') + 'Visiter notre blog</a>',
          '<a href="/support" class="mega-menu-btn mega-menu-btn-primary">' + svgIcon('lifebuoy') + 'Obtenir de l\'aide</a>',
        '</div>',
      '</div>',
    '</div>'
  ].join('');

  var productsMobileItems = [
    makeMobileItem('/products/webinar', 'video-camera', 'Rainbow Webinar', 'Webinaires live et en replay.'),
    makeMobileItem('/products/collaboration', 'chat', 'Rainbow Collaboration', 'Messagerie et canaux d\'équipe.'),
    makeMobileItem('/products/smart-hotel', 'calendar', 'Rainbow Smart Hotel', 'Réservation de salles intelligente.'),
    makeMobileItem('/products/analytics', 'chart-bar', 'Rainbow Analytics', 'Rapports en temps réel.'),
    makeMobileItem('/products/voice', 'phone', 'Rainbow Voice', 'Téléphonie cloud.'),
    makeMobileItem('/products/security', 'lock-closed', 'Rainbow Security', 'Conformité entreprise.')
  ].join('');

  var productsMobileHTML = [
    '<div class="mega-menu-mobile-content">',
      '<div class="mega-menu-mobile-section">',
        '<p class="mega-menu-mobile-section-title">Nos produits</p>',
        productsMobileItems,
        '<a href="/products" class="mega-menu-mobile-see-all">Voir tous les produits <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></a>',
      '</div>',
      '<div class="mega-menu-mobile-section">',
        '<p class="mega-menu-mobile-section-title">À la une</p>',
        '<a href="/products/webinar" class="mega-menu-mobile-item">',
          '<span class="mega-menu-mobile-item-icon">' + svgIcon('video-camera') + '</span>',
          '<span class="mega-menu-mobile-item-text"><p class="mega-menu-mobile-item-title">Rainbow Webinar</p><p class="mega-menu-mobile-item-desc">Nouveau — Webinaires interactifs en direct et en replay.</p></span>',
        '</a>',
      '</div>',
      '<div class="mega-menu-mobile-footer">',
        '<a href="/Démo" class="mega-menu-btn mega-menu-btn-secondary" style="justify-content:center;">Réserver une démo</a>',
        '<a href="/contact" class="mega-menu-btn mega-menu-btn-primary" style="justify-content:center;">Nous contacter</a>',
      '</div>',
    '</div>'
  ].join('');

  var ressourcesMobileItems = [
    makeMobileItem('/blog', 'newspaper', 'Blog', 'Actualités et mises à jour.'),
    makeMobileItem('/tutorials', 'academic-cap', 'Tutoriels', 'Guides pas-à-pas.'),
    makeMobileItem('/docs', 'book-open', 'Documentation', 'Docs API et références.'),
    makeMobileItem('/community', 'users', 'Communauté', 'Partagez vos idées.'),
    makeMobileItem('/support', 'lifebuoy', 'Support', 'Obtenez de l\'aide.'),
    makeMobileItem('/changelog', 'sparkles', 'Nouveautés', 'Dernières fonctionnalités et versions.')
  ].join('');

  var ressourcesMobileHTML = [
    '<div class="mega-menu-mobile-content">',
      '<div class="mega-menu-mobile-section">',
        '<p class="mega-menu-mobile-section-title">Apprendre &amp; Découvrir</p>',
        ressourcesMobileItems,
        '<a href="/ressources" class="mega-menu-mobile-see-all">Parcourir toutes les ressources <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></a>',
      '</div>',
      '<div class="mega-menu-mobile-section">',
        '<p class="mega-menu-mobile-section-title">Guide populaire</p>',
        '<a href="/tutorials" class="mega-menu-mobile-item">',
          '<span class="mega-menu-mobile-item-icon">' + svgIcon('light-bulb') + '</span>',
          '<span class="mega-menu-mobile-item-text"><p class="mega-menu-mobile-item-title">Débuter avec Rainbow</p><p class="mega-menu-mobile-item-desc">Configurez et commencez à utiliser Rainbow en 10 minutes.</p></span>',
        '</a>',
      '</div>',
      '<div class="mega-menu-mobile-footer">',
        '<a href="/blog" class="mega-menu-btn mega-menu-btn-secondary" style="justify-content:center;">Visiter notre blog</a>',
        '<a href="/support" class="mega-menu-btn mega-menu-btn-primary" style="justify-content:center;">Obtenir de l\'aide</a>',
      '</div>',
    '</div>'
  ].join('');

  var tarifsItems = [
    makeItem('/products/webinar/pricing', 'video-camera', 'Rainbow Webinar', 'Plans et tarifs pour nos solutions de webinaires interactifs.'),
    makeItem('/products/collaboration/pricing', 'chat', 'Rainbow Collaboration', 'Tarifs adaptés à vos besoins de collaboration d\'équipe.')
  ].join('');

  var tarifsHTML = [
    '<div class="mega-menu mega-menu-tarifs" role="menu">',
      '<div class="mega-menu-inner">',
        '<div class="mega-menu-main">',
          '<p class="mega-menu-section-title">Nos tarifs</p>',
          '<div class="mega-menu-grid">' + tarifsItems + '</div>',
          '<a href="/tarifs" class="mega-menu-see-all">Voir tous les plans <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></a>',
        '</div>',
      '</div>',
      '<div class="mega-menu-footer">',
        '<p class="mega-menu-footer-text">Des tarifs simples et transparents pour votre équipe.</p>',
        '<div class="mega-menu-footer-actions">',
          '<a href="/contact" class="mega-menu-btn mega-menu-btn-primary">' + svgIcon('lifebuoy') + 'Nous contacter</a>',
        '</div>',
      '</div>',
    '</div>'
  ].join('');

  var tarifsMobileItems = [
    makeMobileItem('/products/webinar/pricing', 'video-camera', 'Rainbow Webinar', 'Plans webinaires.'),
    makeMobileItem('/products/collaboration/pricing', 'chat', 'Rainbow Collaboration', 'Plans collaboration.')
  ].join('');

  var tarifsMobileHTML = [
    '<div class="mega-menu-mobile-content">',
      '<div class="mega-menu-mobile-section">',
        '<p class="mega-menu-mobile-section-title">Nos tarifs</p>',
        tarifsMobileItems,
        '<a href="/tarifs" class="mega-menu-mobile-see-all">Voir tous les plans <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></a>',
      '</div>',
      '<div class="mega-menu-mobile-footer">',
        '<a href="/contact" class="mega-menu-btn mega-menu-btn-primary" style="justify-content:center;">Nous contacter</a>',
      '</div>',
    '</div>'
  ].join('');

  var partenairesItems = [
    makeItem('/partenaires', 'users', 'Devenir un partenaire', 'Rejoignez le réseau Rainbow et développez votre activité avec nos solutions UCaaS souveraines.'),
    makeItem('/partners/portal', 'sparkles', 'Programme de fidélité', 'Accédez aux avantages exclusifs, certifications et récompenses de notre programme.'),
    makeItem('/partners/docs', 'book-open', 'Ressources partenaires', 'Guides, supports marketing, formations et outils dédiés à nos partenaires.')
  ].join('');

  var partenairesHTML = [
    '<div class="mega-menu mega-menu-tarifs" role="menu">',
      '<div class="mega-menu-inner">',
        '<div class="mega-menu-main">',
          '<p class="mega-menu-section-title">Programme partenaires</p>',
          '<div class="mega-menu-grid">' + partenairesItems + '</div>',
          '<a href="/partenaires" class="mega-menu-see-all">Découvrir le programme <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></a>',
        '</div>',
      '</div>',
      '<div class="mega-menu-footer">',
        '<p class="mega-menu-footer-text">Rejoignez plus de 3 000 partenaires Rainbow à travers le monde.</p>',
        '<div class="mega-menu-footer-actions">',
          '<a href="/partenaires" class="mega-menu-btn mega-menu-btn-primary">' + svgIcon('users') + 'Devenir partenaire</a>',
        '</div>',
      '</div>',
    '</div>'
  ].join('');

  var partenaireMobileItems = [
    makeMobileItem('/partenaires', 'users', 'Devenir un partenaire', 'Rejoignez le réseau Rainbow.'),
    makeMobileItem('/partners/portal', 'sparkles', 'Programme de fidélité', 'Avantages exclusifs.'),
    makeMobileItem('/partners/docs', 'book-open', 'Ressources partenaires', 'Guides et certifications.')
  ].join('');

  var partenaireMobileHTML = [
    '<div class="mega-menu-mobile-content">',
      '<div class="mega-menu-mobile-section">',
        '<p class="mega-menu-mobile-section-title">Programme partenaires</p>',
        partenaireMobileItems,
        '<a href="/partenaires" class="mega-menu-mobile-see-all">Découvrir le programme <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></a>',
      '</div>',
      '<div class="mega-menu-mobile-footer">',
        '<a href="/partenaires" class="mega-menu-btn mega-menu-btn-primary" style="justify-content:center;">Devenir partenaire</a>',
      '</div>',
    '</div>'
  ].join('');

  function setupDropdown(dd, trigger, megaHTML, mobileHTML) {
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    trigger.insertAdjacentHTML('afterend', megaHTML);

    var mega = dd.querySelector('.mega-menu');
    if (!mega) return;

    var isOpen = false;
    var hoverTimeout = null;

    function openMenu() {
      if (hoverTimeout) { clearTimeout(hoverTimeout); hoverTimeout = null; }
      dd.classList.add('mega-open');
      trigger.setAttribute('aria-expanded', 'true');
      isOpen = true;
    }

    function closeMenu() {
      if (hoverTimeout) { clearTimeout(hoverTimeout); hoverTimeout = null; }
      dd.classList.remove('mega-open');
      trigger.setAttribute('aria-expanded', 'false');
      isOpen = false;
    }

    dd.addEventListener('mouseenter', function () {
      if (window.innerWidth < 821) return;
      if (hoverTimeout) clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(openMenu, 30);
    });

    dd.addEventListener('mouseleave', function () {
      if (window.innerWidth < 821) return;
      if (hoverTimeout) clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(closeMenu, 150);
    });

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      if (window.innerWidth >= 821) return;
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });

    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        openMenu();
        var firstItem = mega.querySelector('[role="menuitem"]');
        if (firstItem) firstItem.focus();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
        trigger.focus();
      }
    });

    mega.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeMenu();
        trigger.focus();
        return;
      }
      if (e.key === 'Tab') {
        var items = mega.querySelectorAll('[role="menuitem"], a, button');
        if (!items.length) return;
        var first = items[0];
        var lastItem = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          closeMenu();
          trigger.focus();
        } else if (!e.shiftKey && document.activeElement === lastItem) {
          e.preventDefault();
          closeMenu();
          trigger.focus();
        }
      }
    });

  }

  function initMegaMenu() {
    var dropdowns = document.querySelectorAll('.nav-dropdown');
    if (!dropdowns.length) return;

    for (var i = 0; i < dropdowns.length; i++) {
      var dd = dropdowns[i];
      var trigger = dd.querySelector('a');
      if (!trigger) continue;

      var isProducts = dd.querySelector('[data-i18n="nav.product"]') !== null;
      var isRessources = trigger.textContent.trim().toLowerCase() === 'ressources';
      var isTarifs = trigger.textContent.trim().toLowerCase() === 'tarifs';
      var isPartenaires = trigger.textContent.trim().toLowerCase() === 'partenaires';
      if (!isProducts && !isRessources && !isTarifs && !isPartenaires) continue;

      var megaHTML, mobileHTML;
      if (isProducts) {
        megaHTML = productsHTML;
        mobileHTML = productsMobileHTML;
      } else if (isRessources) {
        megaHTML = ressourcesHTML;
        mobileHTML = ressourcesMobileHTML;
      } else if (isPartenaires) {
        megaHTML = partenairesHTML;
        mobileHTML = partenaireMobileHTML;
      } else {
        megaHTML = tarifsHTML;
        mobileHTML = tarifsMobileHTML;
      }

      setupDropdown(dd, trigger, megaHTML, mobileHTML);
    }

    var submenus = document.querySelectorAll('.mobile-submenu');
    for (var j = 0; j < submenus.length; j++) {
      var sm = submenus[j];
      if (!sm.querySelector('a')) continue;

      // Detect section type from the preceding header link's text
      var headerEl = sm.previousElementSibling;
      var headerText = headerEl ? headerEl.textContent.trim().toLowerCase() : '';

      var mobileContent;
      if (headerText.indexOf('produit') !== -1) {
        mobileContent = productsMobileHTML;
      } else if (headerText.indexOf('tarif') !== -1) {
        mobileContent = tarifsMobileHTML;
      } else if (headerText.indexOf('ressource') !== -1) {
        mobileContent = ressourcesMobileHTML;
      } else if (headerText.indexOf('partenaire') !== -1) {
        mobileContent = partenaireMobileHTML;
      } else {
        continue;
      }

      sm.style.display = 'none';
      var wrapper = document.createElement('div');
      wrapper.innerHTML = mobileContent;
      var mobileEl = wrapper.firstElementChild;
      if (!mobileEl) continue;
      sm.parentNode.insertBefore(mobileEl, sm.nextSibling);

      // Wire accordion toggle onto the section header link
      if (headerEl && headerEl.tagName === 'A') {
        (function (content, header) {
          var chevron = document.createElement('svg');
          chevron.setAttribute('fill', 'none');
          chevron.setAttribute('viewBox', '0 0 24 24');
          chevron.setAttribute('stroke', 'currentColor');
          chevron.setAttribute('stroke-width', '2');
          chevron.setAttribute('data-mob-chev', '1');
          chevron.style.cssText = 'width:1rem;height:1rem;flex-shrink:0;margin-left:auto;transition:transform 0.2s ease;';
          chevron.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>';
          header.style.display = 'flex';
          header.style.justifyContent = 'space-between';
          header.style.alignItems = 'center';
          header.style.cursor = 'pointer';
          header.appendChild(chevron);

          header.addEventListener('click', function (e) {
            e.preventDefault();
            var opening = !content.classList.contains('open');
            // Close all sections first
            document.querySelectorAll('.mega-menu-mobile-content').forEach(function (c) {
              c.classList.remove('open');
            });
            document.querySelectorAll('[data-mob-chev]').forEach(function (c) {
              c.style.transform = '';
            });
            if (opening) {
              content.classList.add('open');
              chevron.style.transform = 'rotate(180deg)';
            }
          });
        })(mobileEl, headerEl);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMegaMenu);
  } else {
    initMegaMenu();
  }
})();
