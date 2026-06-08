// Programmatic Content Engine - Nord (59)
// Generates unique, localized helpful content for each commune in the Nord department.
// Uses a deterministic spintax generator (3 variants per content block) to avoid Google HCU/duplicate content penalties.

export interface Commune {
  nom: string;
  slug: string;
  codeInsee: string;
  codePostal: string;
  population: number;
}

export interface LocalContent {
  introParagraph: string;
  logisticsAlert: string;
  useCaseText: string;
  pricesContext: string;
  faqItems: { question: string; answer: string }[];
}

export function getPopTier(pop: number): 'XS' | 'S' | 'M' | 'L' {
  if (pop < 2000) return 'XS';
  if (pop < 15000) return 'S';
  if (pop < 60000) return 'M';
  return 'L';
}

// Deterministic hashing function using the INSEE code
export function getVariantIndex(codeInsee: string, offset: number = 0): number {
  const val = parseInt(codeInsee, 10);
  if (isNaN(val)) return 0;
  return (val + offset) % 3;
}

export function generateCommuneContent(commune: Commune, category: 'main' | 'gravats' | 'encombrants' | 'dechets-verts' | 'dib'): LocalContent {
  const tier = getPopTier(commune.population);
  const deptName = "Nord";
  const deptCode = "59";
  const popStr = commune.population ? ` (${commune.population.toLocaleString('fr-FR')} habitants)` : '';
  
  // Calculate variant indices
  const vIntro = getVariantIndex(commune.codeInsee, 0);
  const vLogistics = getVariantIndex(commune.codeInsee, 1);
  const vPricing = getVariantIndex(commune.codeInsee, 2);
  const vUseCase = getVariantIndex(commune.codeInsee, 3);
  const vFaq = getVariantIndex(commune.codeInsee, 4);

  // Local pricing calculations
  const priceFactor = commune.population && commune.population > 100000 ? 1.15 : commune.population && commune.population > 50000 ? 1.08 : 1;
  const prices = {
    gravats: Math.round(280 * priceFactor),
    dib: Math.round(390 * priceFactor),
    verts: Math.round(320 * priceFactor),
    bois: Math.round(340 * priceFactor)
  };

  // 1. DYNAMIC INTRO PARAGRAPHS (3 variants per tier per category)
  const intros = {
    main: {
      XS: [
        `Pour vos chantiers de rénovation ou de désencombrement à ${commune.nom}${popStr}, petit bourg rural du département du ${deptName}, louer une benne simplifie grandement la gestion de vos déchets. Que ce soit pour vider une grange, restaurer un corps de ferme ou désencombrer une habitation, notre service de pose à domicile vous évite de longs et fatigants trajets vers les déchetteries éloignées du secteur.`,
        `À ${commune.nom}${popStr}, au cœur des paysages préservés du ${deptName}, la gestion des déchets encombrants et des matériaux de chantier nécessite une logistique adaptée. Notre agence livre des bennes de 8m³ à 30m³ directement chez les particuliers et agriculteurs de la commune, assurant un traitement respectueux de l'environnement local.`,
        `Si vous entreprenez des travaux sur votre propriété à ${commune.nom}${popStr}, la location de benne constitue la solution idéale pour évacuer de grands volumes en une seule fois. Nos camions accèdent facilement aux voies rurales et allées privatives de la commune pour déposer la benne au plus près de vos besoins.`
      ],
      S: [
        `À ${commune.nom}${popStr}, commune pavillonnaire et dynamique du ${deptName}, les travaux d'embellissement de l'habitat et de jardinage sont nombreux. Louer une benne à ${commune.nom} permet de rassembler et de faire enlever rapidement tous vos gravats, vieux meubles ou branchages en toute simplicité, sans saturer les infrastructures de collecte locales.`,
        `Les résidents de ${commune.nom}${popStr} bénéficient d'un service de location de benne réactif et de proximité pour tous leurs projets de bricolage ou de déménagement. Nous mettons à disposition des bennes adaptées aux zones résidentielles, facilitant l'évacuation propre de vos encombrants mélangés ou de vos déchets de rénovation.`,
        `Pour simplifier vos travaux de rénovation de maison ou d'appartement à ${commune.nom}${popStr}, la dépose d'une benne tout-venant ou gravats dans votre allée est la formule la plus pratique. Notre flotte dessert l'ensemble des quartiers de la commune pour garantir des rotations rapides.`
      ],
      M: [
        `La ville de ${commune.nom}${popStr} connaît une activité de rénovation constante, tant pour les habitations que pour les commerces locaux. Pour accompagner ces chantiers, nous proposons aux professionnels et aux particuliers un service complet de location de bennes, de la livraison du contenant jusqu'à la valorisation finale des déchets en centre agréé du ${deptName}.`,
        `Située dans le bassin urbain du ${deptName}, la commune de ${commune.nom}${popStr} requiert une logistique de tri stricte pour les chantiers de construction ou d'aménagement. Nos bennes de 8 à 30 mètres cubes permettent de trier efficacement les métaux, le bois, le plâtre et le plastique directement à la source.`,
        `À ${commune.nom}${popStr}, évacuer des volumes importants de résidus de démolition ou d'encombrants professionnels devient simple. Notre service assure la pose, le retrait rapide sous 24h et la fourniture des bordereaux de suivi des déchets pour une conformité réglementaire absolue.`
      ],
      L: [
        `En tant que pôle urbain majeur ou grande métropole du ${deptName}, ${commune.nom}${popStr} concentre d'importants chantiers industriels, commerciaux et résidentiels. Notre service de location de bennes y répond avec une réactivité maximale, un large catalogue de volumes (jusqu'à 30m³) et un accompagnement complet pour la gestion environnementale de vos chantiers.`,
        `Au sein du tissu urbain dense de ${commune.nom}${popStr}, la gestion réglementaire des déchets de chantier (DIB, gravats inertes, bois) exige une logistique sans faille. Nous assurons la mise à disposition rapide de bennes de tri et le transport sécurisé vers les filières de valorisation agréées de la région Hauts-de-France.`,
        `Face aux enjeux de transition écologique à ${commune.nom}${popStr}, notre entreprise aide les maîtres d'œuvre et les particuliers à valoriser leurs volumes de déchets. Nous desservons tous les arrondissements et quartiers industriels de la commune pour des évacuations de bennes fluides.`
      ]
    },
    gravats: {
      XS: [
        `Évacuer des gravats inertes comme du béton armé, des briques ou des tuiles à ${commune.nom} nécessite des bennes robustes. Vu le profil rural de la commune, le stationnement sur votre terrain privé facilite la pose d'une benne de 8m³ pour vos démolitions de murs ou de dalles.`,
        `Pour vos travaux de terrassement ou de réfection de toiture à ${commune.nom}, nous livrons des bennes spécifiquement renforcées pour les matériaux lourds. Idéal pour les anciennes bâtisses de campagne de la commune.`,
        `Le déblaiement de terre, cailloux ou carrelage à ${commune.nom} s'effectue sans effort avec notre service de location. Nous déposons une benne de taille moyenne, évitant d'endommager les chemins d'accès locaux.`
      ],
      S: [
        `Nos bennes à gravats de 8m³ sont idéales pour les chantiers de dallage ou de rénovation à ${commune.nom}. Nos chauffeurs accèdent aisément aux allées résidentielles de la commune pour y déposer votre benne à gravats propres.`,
        `À ${commune.nom}, évacuez proprement briques, tuiles et restes de ciment. Louer une benne à gravats évite de surcharger votre véhicule et préserve la propreté de votre quartier durant vos travaux.`,
        `Simplifiez le retrait de vos déchets inertes à ${commune.nom} avec une benne de 8m³ (capacité maximale autorisée pour le transport de matériaux très lourds et denses comme la terre ou le béton).`
      ],
      M: [
        `Les rénovations immobilières à ${commune.nom} génèrent des volumes conséquents de briques et de carrelage. Nos bennes à gravats sont positionnées sur vos chantiers urbains pour recueillir ces matériaux valorisables en filière de recyclage locale.`,
        `Pour le terrassement de votre terrain ou l'évacuation de dalles en béton à ${commune.nom}, louez une benne gravats de 8m³. Nous assurons un transport sécurisé et le respect de la charge utile autorisée sur la voirie.`,
        `Notre agence dessert tous les quartiers de ${commune.nom} pour livrer des bennes destinées aux gravats propres ou mélangés (béton, tuile, ardoise, parpaing) issus de vos démolitions.`
      ],
      L: [
        `À ${commune.nom}, les contraintes de voirie imposent une grande précision pour la pose de bennes à gravats lourds. Nos camions équipés déposent des bennes de 8m³ sur vos chantiers de déconstruction urbaine en toute sécurité.`,
        `La gestion des gravats inertes de chantiers de grande envergure à ${commune.nom} nécessite une rotation fluide. Nous fournissons des bennes renforcées et assurons des collectes programmées vers les exutoires agréés du ${deptName}.`,
        `Que ce soit pour de la démolition de structures en béton ou le déblaiement de voirie à ${commune.nom}, nous livrons le matériel réglementaire nécessaire pour transporter vos inertes sans risque d'amende pour surcharge.`
      ]
    },
    encombrants: {
      XS: [
        `Le débarras d'une maison de campagne ou d'une dépendance agricole à ${commune.nom} produit de grandes quantités d'objets hétéroclites. Louer une benne encombrants de 10m³ à 20m³ permet de trier et de jeter tout le mobilier dégradé en une seule rotation.`,
        `Pour vider une habitation suite à une vente ou un sinistre à ${commune.nom}, la benne tout-venant est la solution de facilité. Vous y déposez matelas, cartons et vieux appareils sans tri fastidieux préalable.`,
        `Notre service de location de benne à ${commune.nom} vous permet de désencombrer votre grenier ou grange en un temps record, avec un dépôt sur votre terrain adapté aux camions de livraison.`
      ],
      S: [
        `Lors d'un déménagement ou d'un grand nettoyage de printemps à ${commune.nom}, accumuler des vieux meubles ou cartons est fréquent. Nos bennes encombrants (10m³ à 15m³) se garent facilement devant chez vous dans la commune.`,
        `À ${commune.nom}, évacuez canapés, literies et électroménagers usagés grâce à notre benne DIB non dangereux pour particuliers. Nous recyclons au maximum le bois et le plastique collectés.`,
        `Vous videz une habitation familiale ou procédez à une succession à ${commune.nom} ? Une benne tout-venant de grand volume simplifie les manipulations et centralise tous vos déchets.`
      ],
      M: [
        `Les entreprises et les particuliers de ${commune.nom} font appel à nos services pour le débarras de bureaux ou d'appartements. Nos bennes encombrants collectent tout le mobilier obsolète et les archives à détruire.`,
        `Pour désencombrer des entrepôts ou des locaux commerciaux à ${commune.nom}, nous livrons des bennes de 15m³ à 20m³ adaptées à vos volumes de déchets mixtes non dangereux.`,
        `Le traitement des encombrants à ${commune.nom} passe par des centres de tri haute performance. En louant notre benne, vous garantissez la valorisation matière de vos meubles et emballages.`
      ],
      L: [
        `Pour les opérations de vidage de grands bâtiments ou de commerces à ${commune.nom}, la réactivité logistique est primordiale. Nous mettons à disposition des bennes de 20m³ à 30m³ avec des portes arrière pour faciliter le chargement manuel.`,
        `La gestion des flux d'encombrants urbains à ${commune.nom} requiert des bennes de grand volume. Nous gérons le transport sécurisé dans les centres de valorisation de l'agglomération pour maximiser le recyclage.`,
        `Nos bennes pour tout-venant et encombrants s'adaptent aux contraintes d'accès des immeubles et zones tertiaires de ${commune.nom}, avec des rotations rapides selon vos plannings de chantiers.`
      ]
    },
    'dechets-verts': {
      XS: [
        `L'entretien des grands jardins ou l'élagage de haies arborées à ${commune.nom} génère de très importants volumes de végétaux. Rappelons que le brûlage des déchets verts à l'air libre est interdit par arrêté préfectoral dans le ${deptCode} (passible d'une amende de 450 €). Notre benne paysagère est l'alternative écologique indispensable.`,
        `Pour valoriser vos tailles d'arbres, souches et tontes à ${commune.nom}, louez une benne verte. Nous transportons vos déchets végétaux vers des plateformes de compostage industriel du département.`,
        `Évitez les multiples trajets en remorque vers la déchetterie locale depuis ${commune.nom}. Notre benne de 15m³ accueille toutes vos branches et feuillages en une seule fois.`
      ],
      S: [
        `À ${commune.nom}, commune verdoyante, l'entretien paysager produit de gros tas de branches. Louer une benne à déchets verts vous garantit une évacuation conforme, sans risque de contravention pour brûlage sauvage.`,
        `Notre benne paysagère de 10m³ à 15m³ se dépose facilement dans les allées des résidences de ${commune.nom}. Parfait pour les travaux saisonniers d'élagage ou de débroussaillage.`,
        `Valorisez vos branchages et gazons coupés à ${commune.nom} en louant une benne spécifique. Vos déchets de jardin seront transformés en compost agricole local.`
      ],
      M: [
        `Les paysagistes et copropriétés de ${commune.nom} font régulièrement appel à nos bennes pour évacuer les souches et les branches. La benne verte permet de maintenir les chantiers propres et sécurisés.`,
        `À ${commune.nom}, les résidus de tonte de pelouse ou d'abattage d'arbres sont acheminés vers des filières de valorisation biologique. Louer une benne dédiée évite de souiller les bennes tout-venant.`,
        `Nous livrons des bennes paysagères de 15m³ à 20m³ à ${commune.nom} pour toutes vos opérations d'entretien d'espaces verts d'entreprises ou de parcs privatifs.`
      ],
      L: [
        `L'entretien des parcs publics et des jardins urbains à ${commune.nom} demande un traitement de gros volumes végétaux. Nos bennes paysagères de 30m³ permettent d'évacuer des tonnes de branches en un minimum de rotations.`,
        `Pour vos chantiers de création de parcs ou de déboisage à ${commune.nom}, nous assurons des rotations régulières de bennes à végétaux, en lien avec les plateformes de compostage de la métropole.`,
        `Nous accompagnons les professionnels du paysage à ${commune.nom} avec un service de location de benne flexible, garantissant la traçabilité écologique de vos déchets de coupe.`
      ]
    },
    dib: {
      XS: [
        `Le tri des déchets industriels banals (bois, métaux, cartons, plastiques) sur vos chantiers à ${commune.nom} est essentiel pour limiter vos coûts de traitement. La benne DIB mélangé est adaptée pour les rénovations de fermettes ou de granges.`,
        `Pour évacuer vos résidus de chantiers de construction ou de charpente à ${commune.nom}, la benne DIB vous évite d'enfouir des matériaux recyclables. Idéal pour séparer le bois brut des autres déchets non dangereux.`,
        `Nos bennes DIB livrées à ${commune.nom} facilitent l'évacuation des métaux, isolants et emballages plastiques pour les artisans du bâtiment exerçant en zone rurale.`
      ],
      S: [
        `Nos bennes DIB de 10m³ à 20m³ à ${commune.nom} sont parfaites pour les artisans en plomberie, électricité ou charpente. Le tri à la source permet de réduire considérablement vos frais de décharge professionnelle.`,
        `À ${commune.nom}, facilitez le recyclage des matériaux de second œuvre (plâtre propre, isolants, tuyaux PVC, gaines). Nos bennes DIB accueillent vos mélanges de chantiers résidentiels.`,
        `La location d'une benne DIB à ${commune.nom} simplifie le nettoyage de vos chantiers de construction de maisons individuelles ou d'extensions de bâtiments.`
      ],
      M: [
        `Le décret 7 flux impose aux entreprises de ${commune.nom} le tri séparé du papier, métal, plastique, verre, bois, fraction minérale et plâtre. Nos bennes DIB sont l'outil idéal pour respecter cette réglementation sur vos chantiers locaux.`,
        `Pour le débarras industriel ou la rénovation de locaux commerciaux à ${commune.nom}, nous proposons des bennes DIB avec suivi rigoureux des déchets et certificats de valorisation pour vos audits RSE.`,
        `Notre service logistique à ${commune.nom} livre des bennes de 15m³ ou 20m³ pour le bois de coffrage, les palettes et les isolants de vos chantiers de moyenne envergure.`
      ],
      L: [
        `Dans les grands chantiers tertiaires et commerciaux de ${commune.nom}, la traçabilité des déchets DIB est une obligation réglementaire stricte. Nous fournissons des bordereaux de suivi (BSDD) et trions vos déchets en centre de tri agréé.`,
        `Nous mettons en place des bennes DIB de 30m³ pour les usines, plateformes logistiques et gros chantiers de second œuvre à ${commune.nom}, avec un service de rotation sur simple appel téléphonique.`,
        `Optimisez votre gestion de déchets de chantier à ${commune.nom} en choisissant nos bennes DIB tout-venant. Nous assurons la collecte et le tri robotisé pour réintégrer les métaux et cartons dans l'économie circulaire.`
      ]
    }
  };

  // 2. DYNAMIC LOGISTICS / REGULATORY WARNINGS (3 variants per tier)
  const logistics = {
    XS: [
      `Dans une commune rurale comme ${commune.nom}, les voies d'accès sont souvent dégagées mais parfois étroites (chemins de terre, ponts à charge limitée). Veuillez vérifier que notre camion poids lourd (3m de large, 19T) peut manœuvrer. Pour un dépôt sur la voie publique, une déclaration préalable auprès de la mairie de ${commune.nom} est conseillée.`,
      `Pour un dépôt sur terrain privé à ${commune.nom}, aucune démarche n'est requise. Si la benne doit empiéter sur un chemin communal, veillez à prévenir le secrétariat de mairie au moins 3 jours à l'avance pour éviter tout blocage de tracteurs ou de véhicules de secours.`,
      `Le sol de votre terrain à ${commune.nom} doit être stable pour supporter le poids de la benne chargée (surtout pour les gravats). Si la pose s'effectue sur la chaussée publique rurale, vérifiez les arrêtés locaux de circulation auprès des services municipaux.`
    ],
    S: [
      `À ${commune.nom}, le stationnement dans les zones pavillonnaires est réglementé. Pour poser une benne sur la voie publique, une demande d'Autorisation d'Occupation Temporaire (AOT) doit être soumise à la mairie de ${commune.nom} 5 jours ouvrés à l'avance. Pensez à prévoir des cônes de signalisation si la benne déborde.`,
      `Si vous disposez d'une cour ou d'un jardin à ${commune.nom}, nos chauffeurs peuvent y déposer la benne pour vous éviter des formalités administratives. Pour un dépôt sur un trottoir ou une place de stationnement, le formulaire de voirie de la commune est obligatoire.`,
      `La mairie de ${commune.nom} exige un arrêté de circulation si la benne perturbe le passage des bus ou des riverains. Contactez le service urbanisme de la commune pour valider l'emplacement de voirie choisi.`
    ],
    M: [
      `Les contraintes de circulation urbaine à ${commune.nom} imposent des règles strictes. L'autorisation d'occupation temporaire (AOT) du domaine public doit être demandée auprès des services techniques de la mairie de ${commune.nom} (délai de 7 à 10 jours). Un balisage nocturne de la benne est requis s'il y a empiètement sur la chaussée.`,
      `À ${commune.nom}, les dépôts sur les places de parking payantes nécessitent de s'acquitter des droits de stationnement municipaux. Rapprochez-vous de la mairie pour obtenir l'arrêté temporaire d'interdiction de stationner pour réserver l'emplacement du camion.`,
      `Le dépôt de benne sur le domaine public à ${commune.nom} implique la responsabilité du demandeur. Assurez-vous d'avoir obtenu l'accord écrit de la municipalité avant notre livraison pour éviter des amendes de voirie.`
    ],
    L: [
      `Dans l'agglomération très dense de ${commune.nom}, les règles de voirie sont drastiques. Une demande d'arrêté de stationnement et d'autorisation de voirie doit être déposée en mairie de ${commune.nom} au moins 15 jours à l'avance. Le balisage réfléchissant et le respect des couloirs de bus et pistes cyclables sont contrôlés par la police municipale.`,
      `À ${commune.nom}, la pose en hypercentre nécessite des camions adaptés ou des livraisons en horaires décalés pour ne pas bloquer les flux de circulation. L'obtention de l'autorisation municipale de voirie est indispensable avant de planifier la dépose.`,
      `Les chantiers urbains à ${commune.nom} doivent respecter la charte locale des chantiers (bruit, poussière, sécurité). Prévoyez des plaques de protection pour le sol (trottoirs fragiles) et assurez-vous d'avoir le numéro d'arrêté municipal affiché sur la benne.`
    ]
  };

  // 3. DYNAMIC USE CASES (3 variants per category)
  const useCases = {
    main: [
      `évacuer tous vos déchets de chantier ou encombrants lors de rénovations de maisons individuelles ou de locaux commerciaux.`,
      `désencombrer de grands volumes accumulés dans des habitations, des entrepôts ou des dépendances professionnelles du Nord.`,
      `gérer proprement le tri de vos chantiers de construction, d'extension de maison ou d'aménagement extérieur.`
    ],
    gravats: [
      `stocker et transporter le béton armé, les parpaings, le carrelage et les tuiles issus de démolitions de murs ou de toitures.`,
      `évacuer les surplus de terre végétale brute, de cailloux et de pierres lors de vos travaux de terrassement et de création de piscine.`,
      `rassembler les résidus inertes de chantiers de maçonnerie pour les envoyer en centre de recyclage et concassage routier.`
    ],
    encombrants: [
      `débarrasser les meubles anciens, électroménagers usagés, matelas et cartons lors d'un déménagement, d'un vide-maison ou d'une succession.`,
      `évacuer tous les déchets hétéroclites et volumineux accumulés dans vos caves, greniers ou garages personnels.`,
      `nettoyer des locaux professionnels après un changement de mobilier ou la fermeture d'un point de vente local.`
    ],
    'dechets-verts': [
      `regrouper les branches d'arbres, souches, tontes de pelouses et tailles de haies après un grand nettoyage saisonnier de jardin.`,
      `évacuer les résidus d'élagage, d'abattage d'arbres et de débroussaillage de parcelles agricoles ou de copropriétés.`,
      `rassembler les terres de déblais mélangées à des racines ou gazons de placage lors de travaux d'aménagement paysager.`
    ],
    dib: [
      `trier le bois de charpente, les métaux, les cloisons en plâtre (BA13) et les plastiques issus de chantiers de second œuvre.`,
      `évacuer les déchets industriels banals mélangés des chantiers d'artisans (peintres, plaquistes, électriciens).`,
      `collecter les chutes de matériaux d'emballage, de cartons et de palettes en bois issus d'activités logistiques ou commerciales.`
    ]
  };

  // 4. DYNAMIC PRICING CONTEXT (3 variants per tier)
  const pricing = {
    XS: [
      `Les tarifs à ${commune.nom} reflètent les prix moyens du département du ${deptName}. En raison du caractère excentré de la commune, la part du transport du camion peut peser sur la facture. Regrouper vos volumes dans une seule benne est le choix le plus astucieux pour optimiser vos frais.`,
      `Pour la commune de ${commune.nom}, le prix inclut la livraison, 5 jours de location, le retrait et les frais de traitement. Trier vos gravats ou vos déchets végétaux séparément vous permet de bénéficier de tarifs de décharge très avantageux.`,
      `Le prix à ${commune.nom} est calculé au plus juste. En choisissant une benne de taille adaptée (8m³ pour le lourd, 15m³ ou 30m³ pour le léger), vous évitez des rotations inutiles et maîtrisez votre budget de chantier.`
    ],
    S: [
      `À ${commune.nom}, les prix de location sont particulièrement compétitifs en raison de la proximité des axes routiers majeurs du ${deptName}. Nous recommandons de trier vos matériaux à la source (par exemple, uniquement du béton/tuiles ou uniquement des branchages) pour réduire de près de 30% les coûts de décharge professionnelle.`,
      `Les tarifs de location à ${commune.nom} sont stables. Le forfait comprend le transport aller-retour et le traitement en centre agréé. Une prolongation de location au-delà de 5 jours est possible sur simple demande écrite.`,
      `Nos devis pour ${commune.nom} sont transparents et sans frais cachés. Le tarif varie selon la nature du déchet : les bennes de gravats propres ou de bois sont moins chères à traiter que le tout-venant mélangé (DIB).`
    ],
    M: [
      `Le coût d'une benne à ${commune.nom} intègre les taxes environnementales locales (TGAP) appliquées dans le bassin métropolitain du ${deptName}. Pour les professionnels, la fourniture des bordereaux de suivi des déchets (BSDD) est incluse d'office dans notre prestation pour garantir votre traçabilité.`,
      `À ${commune.nom}, les tarifs de location s'adaptent à vos contraintes de chantier. Si la benne est posée en zone payante, le coût de réservation de l'emplacement de voirie municipale est à la charge du client.`,
      `Nous proposons des forfaits tout compris pour la ville de ${commune.nom}. Nos partenariats avec les centres de valorisation industrielle de la région Hauts-de-France nous permettent de vous proposer des prix de traitement DIB très attractifs.`
    ],
    L: [
      `Compte tenu de la forte densité à ${commune.nom}, les tarifs de location intègrent les contraintes logistiques urbaines (temps de parcours, accès restreints). Les prix sont calculés de manière transparente et comprennent le dépôt, le retrait et le tri sélectif en centre de valorisation métropolitain du ${deptName}.`,
      `Les tarifs de location de benne à ${commune.nom} dépendent fortement du respect du tri réglementaire (loi AGEC). Les déchets mélangés non triés subissent des pénalités de décharge importantes, c'est pourquoi nous conseillons d'opter pour des bennes mono-flux (bois, métaux ou carton) lorsque c'est possible.`,
      `À ${commune.nom}, profitez de nos tarifs négociés avec les plus grandes décharges professionnelles de l'agglomération du Nord. Nos conseillers vous aident à choisir la taille de benne idéale pour minimiser vos taxes de mise en décharge.`
    ]
  };

  // 5. DYNAMIC LOCALIZED FAQS (3 sets based on hash index)
  const faqSets = [
    [
      {
        question: `Combien coûte la location d'une benne à ${commune.nom} ?`,
        answer: `Le prix moyen d'une benne à gravats (8m³) à ${commune.nom} est d'environ ${prices.gravats}€ HT, tandis qu'une benne DIB mélangé (10m³) commence à environ ${prices.dib}€ HT. Ce tarif comprend la pose du caisson, la location pour quelques jours, le retrait par notre chauffeur et le tri dans le département du ${deptName}.`
      },
      {
        question: `Puis-je poser la benne sur la voie publique à ${commune.nom} ?`,
        answer: tier === 'XS'
          ? `Dans les petites communes rurales comme ${commune.nom}, le dépôt sur voirie nécessite une déclaration simple auprès du secrétariat de la mairie. Si vous disposez d'un terrain privé, privilégiez-le pour éviter toute démarche.`
          : `Oui, mais cela nécessite d'obtenir une Autorisation d'Occupation Temporaire (AOT) délivrée par la mairie de ${commune.nom}. Le délai d'instruction varie de 5 à 12 jours. Le dépôt sur propriété privée (cour, jardin, chantier clos) est quant à lui totalement libre et sans formalité.`
      },
      {
        question: `Que se passe-t-il si je dépasse le poids limite de la benne ?`,
        answer: `Pour des raisons de sécurité routière et de préservation de la voirie à ${commune.nom}, nos camions ne peuvent pas transporter de bennes en surcharge. Une benne de gravats ne doit contenir que des inertes et ne pas dépasser le niveau du bord supérieur du caisson.`
      }
    ],
    [
      {
        question: `Quel est le délai de livraison d'une benne à ${commune.nom} ?`,
        answer: tier === 'L' || tier === 'M'
          ? `Nous intervenons très rapidement sur l'agglomération de ${commune.nom}, avec une livraison sous 24 à 48 heures ouvrées. En période de forte demande (printemps et automne), nous conseillons de bloquer votre créneau 72 heures à l'avance.`
          : `Compte tenu de notre maillage de transporteurs dans le ${deptName}, comptez un délai moyen de livraison de 48 heures pour la commune de ${commune.nom}. Nous calons l'heure de passage en fonction de vos disponibilités.`
      },
      {
        question: `Quels sont les déchets strictement interdits dans vos bennes à ${commune.nom} ?`,
        answer: `Il est strictement interdit de déposer des déchets dangereux : amiante, pots de peinture pleins, solvants, batteries, pneus et bouteilles de gaz. Pour ces déchets spécifiques, vous devez vous orienter vers des filières de collecte spécialisées du ${deptCode}.`
      },
      {
        question: `Quelle taille de benne dois-je choisir pour vider ma maison à ${commune.nom} ?`,
        answer: `Pour un débarras classique (meubles, cartons, tapis), nous conseillons généralement une benne de 10m³ à 15m³. Pour vider entièrement une maison à ${commune.nom}, une benne de 20m³ voire 30m³ est plus adaptée pour éviter une double rotation.`
      }
    ],
    [
      {
        question: `Comment se passe le paiement de la location de benne à ${commune.nom} ?`,
        answer: `Le règlement s'effectue généralement par carte bancaire ou virement lors de la réservation de la benne. Pour les professionnels du bâtiment et gros clients réguliers sur le secteur de ${commune.nom}, des conditions de facturation personnalisées peuvent être mises en place.`
      },
      {
        question: `Est-il obligatoire de trier ses déchets à ${commune.nom} ?`,
        answer: `Oui, pour les professionnels (décret 7 flux) et fortement conseillé pour les particuliers. À ${commune.nom}, louer une benne mono-flux (uniquement du bois ou uniquement des gravats) réduit significativement le coût final de traitement par rapport à une benne tout-venant.`
      },
      {
        question: `Le camion peut-il passer sous les lignes électriques ou les porches à ${commune.nom} ?`,
        answer: `Nos camions nécessitent une hauteur de passage minimale de 4,50 mètres et une largeur de 3 mètres. Si le chemin d'accès à votre chantier à ${commune.nom} présente un obstacle (porche étroit, lignes basses), veuillez le signaler à notre conseiller lors du devis.`
      }
    ]
  ];

  return {
    introParagraph: intros[category][tier][vIntro],
    logisticsAlert: logistics[tier][vLogistics],
    useCaseText: useCases[category][vUseCase],
    pricesContext: pricing[tier][vPricing],
    faqItems: faqSets[vFaq]
  };
}
