#!/usr/bin/env node
/*
 * i18n-add-js-keys.js — add the `<page>.js.*` catalogue branches.
 *
 * Strings that live inside inline <script> blocks (locator labels, form modal
 * copy, toggle text) cannot carry a data-i18n marker, so the markup extractor
 * cannot see them. Every value below was read out of the original hand-
 * translated pages — none of it is newly authored.
 *
 * Idempotent: re-running only fills in what is absent.
 *
 * Run:  node tools/i18n-add-js-keys.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const L = require('./i18n-lib.js');

const ROOT = path.join(__dirname, '..');
const LANGS = ['fr', 'en', 'de'];

// page -> key -> {fr, en, de}
const JS_KEYS = {
    'trouver-un-partenaire': {
        statPartners: { fr: 'partenaires', en: 'partners', de: 'Partner' },
        statCountries: { fr: 'pays', en: 'countries', de: 'Länder' },
        statHq: { fr: 'sièges sociaux', en: 'headquarters', de: 'Hauptsitze' },
        loadError: {
            fr: 'Impossible de charger les partenaires',
            en: 'Unable to load partners',
            de: 'Partner konnten nicht geladen werden',
        },
        errorPrefix: { fr: 'Erreur : ', en: 'Error: ', de: 'Fehler: ' },
        badgeHq: { fr: '★ Siège', en: '★ HQ', de: '★ Hauptsitz' },
        badgeHqLong: { fr: '★ Siège social', en: '★ HQ', de: '★ Hauptsitz' },
        badgeSub: { fr: 'Filiale', en: 'Branch', de: 'Niederlassung' },
        emptyTitle: {
            fr: 'Aucun partenaire trouvé',
            en: 'No partners found',
            de: 'Keine Partner gefunden',
        },
        emptyHint: {
            fr: "Essayez d'élargir votre recherche ou de retirer un filtre.",
            en: 'Try broadening your search or removing a filter.',
            de: 'Versuchen Sie, Ihre Suche zu erweitern oder einen Filter zu entfernen.',
        },
        collapse: { fr: 'Réduire', en: 'Collapse', de: 'Verkleinern' },
        expand: { fr: 'Agrandir', en: 'Expand', de: 'Vergrößern' },
        locale: { fr: 'fr-FR', en: 'en-GB', de: 'de-DE' },
    },
    'tarifs': {
        hideTable: {
            fr: 'Masquer le tableau comparatif',
            en: 'Hide comparison table',
            de: 'Vergleichstabelle ausblenden',
        },
        showTable: {
            fr: 'Comparer toutes les fonctionnalités',
            en: 'Compare all features',
            de: 'Alle Funktionen vergleichen',
        },
    },
    'collaboration': {
        hideTable: {
            fr: 'Masquer le tableau comparatif',
            en: 'Hide the comparison table',
            de: 'Vergleichstabelle ausblenden',
        },
        showTable: {
            fr: 'Comparer toutes les fonctionnalités',
            en: 'Compare all features',
            de: 'Alle Funktionen vergleichen',
        },
    },
    'webinar': {
        hideTable: {
            fr: 'Masquer le tableau comparatif',
            en: 'Hide the comparison table',
            de: 'Vergleichstabelle ausblenden',
        },
        showTable: {
            fr: 'Comparer toutes les fonctionnalités',
            en: 'Compare all features',
            de: 'Alle Funktionen vergleichen',
        },
        demoTitle: {
            fr: 'Besoin d\'une démo <span class="text-brand-500">Rainbow Webinar</span>&nbsp;?',
            en: 'Need a <span class="text-brand-500">Rainbow Webinar</span> demo&nbsp;?',
            de: 'Benötigen Sie eine <span class="text-brand-500">Rainbow Webinar</span>-Demo&nbsp;?',
        },
        demoSubmit: { fr: 'Demander une démo', en: 'Request a demo', de: 'Demo anfordern' },
        demoSubtitle: {
            fr: 'Laissez-nous vos coordonnées pour planifier une démo avec notre équipe commerciale. Nous passerons en revue les fonctionnalités Enterprise et répondrons à vos questions.',
            en: 'Leave us your details to schedule a demo with our sales team. We\'ll walk you through the Enterprise features and answer your questions.',
            de: 'Hinterlassen Sie uns Ihre Kontaktdaten, um eine Demo mit unserem Vertriebsteam zu vereinbaren. Wir zeigen Ihnen die Enterprise-Funktionen und beantworten Ihre Fragen.',
        },
        demoSuccess: {
            fr: 'Votre demande a bien été enregistrée. Un membre de notre équipe commerciale vous recontactera sous 24h ouvrées.',
            en: 'Your request has been received. A member of our sales team will get back to you within 24 business hours.',
            de: 'Ihre Anfrage wurde erfolgreich erfasst. Ein Mitglied unseres Vertriebsteams wird sich innerhalb von 24 Werkstunden bei Ihnen melden.',
        },
        videoSubtitle: {
            fr: 'Laissez-nous vos coordonnées et nous vous envoyons une vidéo de démonstration du produit par e-mail, sans rendez-vous nécessaire.',
            en: 'Leave us your details and we\'ll email you a video demonstration of the product, no appointment needed.',
            de: 'Hinterlassen Sie uns Ihre Kontaktdaten und wir senden Ihnen eine Video-Demonstration des Produkts per E-Mail, ganz ohne Termin.',
        },
        videoSuccess: {
            fr: 'Votre demande a bien été enregistrée. Vous recevrez la vidéo de démonstration par e-mail sous quelques minutes.',
            en: 'Your request has been received. You\'ll receive the demonstration video by email within a few minutes.',
            de: 'Ihre Anfrage wurde erfolgreich erfasst. Sie erhalten das Demonstrationsvideo innerhalb weniger Minuten per E-Mail.',
        },
        videoTitle: {
            fr: 'Recevez une <span class="text-brand-500">démonstration vidéo</span>',
            en: 'Get a <span class="text-brand-500">video demo</span>',
            de: 'Erhalten Sie eine <span class="text-brand-500">Video-Demo</span>',
        },
        videoSubmit: {
            fr: 'Recevoir la démo vidéo', en: 'Get the video demo', de: 'Video-Demo erhalten',
        },
        sending: { fr: 'Envoi en cours…', en: 'Sending…', de: 'Wird gesendet…' },
    },
    'partenaires': {
        testimonialLabel: { fr: 'Témoignage', en: 'Testimonial', de: 'Erfahrungsbericht' },
    },
};

let added = 0, skipped = 0;
for (const lang of LANGS) {
    const file = path.join(ROOT, 'i18n', lang + '.json');
    const cat = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const [page, keys] of Object.entries(JS_KEYS)) {
        for (const [k, vals] of Object.entries(keys)) {
            const full = `${page}.js.${k}`;
            if (L.getKey(cat, full) !== undefined) { skipped++; continue; }
            L.setKey(cat, full, vals[lang]);
            added++;
        }
    }
    fs.writeFileSync(file, JSON.stringify(L.sortDeep(cat), null, 2) + '\n', 'utf8');
}

console.log(`js keys: ${added} added, ${skipped} already present (across ${LANGS.join(', ')})`);
