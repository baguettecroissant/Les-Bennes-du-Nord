// Programmatic Content Engine - Nord (59)
// Generates unique, localized helpful content for each commune in the Nord department.
// Uses a deterministic spintax generator (7 variants per content block) to avoid Google HCU/duplicate content penalties.

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
  ecoText: string;
  localContext: string;
}

export function getPopTier(pop: number): 'XS' | 'S' | 'M' | 'L' {
  if (pop < 2000) return 'XS';
  if (pop < 15000) return 'S';
  if (pop < 60000) return 'M';
  return 'L';
}

// Improved deterministic hashing using slug characters for better distribution
export function getVariantIndex(slug: string, offset: number = 0, maxVariants: number = 7): number {
  let hash = offset * 31;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % maxVariants;
}

export function generateCommuneContent(commune: Commune, category: 'main' | 'gravats' | 'encombrants' | 'dechets-verts' | 'dib'): LocalContent {
  const tier = getPopTier(commune.population);
  const deptName = "Nord";
  const deptCode = "59";
  const popStr = commune.population ? ` (${commune.population.toLocaleString('fr-FR')} habitants)` : '';
  
  // Calculate variant indices using slug-based hash for much better distribution
  const vIntro = getVariantIndex(commune.slug, 0);
  const vLogistics = getVariantIndex(commune.slug, 1);
  const vPricing = getVariantIndex(commune.slug, 2);
  const vUseCase = getVariantIndex(commune.slug, 3);
  const vFaq = getVariantIndex(commune.slug, 4);
  const vEco = getVariantIndex(commune.slug, 5);

  // Local pricing calculations
  const priceFactor = commune.population && commune.population > 100000 ? 1.15 : commune.population && commune.population > 50000 ? 1.08 : 1;
  const prices = {
    gravats: Math.round(280 * priceFactor),
    dib: Math.round(390 * priceFactor),
    verts: Math.round(320 * priceFactor),
    bois: Math.round(340 * priceFactor)
  };

  // UNIQUE LOCAL CONTEXT paragraph (always unique per commune)
  const localContextVariants = [
    `Avec ses ${commune.population?.toLocaleString('fr-FR') || 'quelques'} résidents et son code postal ${commune.codePostal}, ${commune.nom} fait partie des communes du département du ${deptName} où la demande en évacuation de déchets de chantier reste soutenue tout au long de l'année.`,
    `Implantée dans le ${deptCode} sous le code postal ${commune.codePostal}, la commune de ${commune.nom}${popStr} bénéficie de notre couverture logistique optimale. Nos camions desservent régulièrement ce secteur avec des délais de livraison maîtrisés.`,
    `${commune.nom}${popStr}, située dans l'arrondissement rattaché au code postal ${commune.codePostal}, est au cœur de notre zone d'intervention dans le ${deptName}. La proximité avec nos centres de tri partenaires nous permet de proposer des tarifs compétitifs sur cette commune.`,
    `La commune de ${commune.nom} (${commune.codePostal})${popStr} est desservie par nos transporteurs agréés dans le cadre de notre maillage départemental du ${deptCode}. Le temps de trajet depuis notre base permet des livraisons rapides et des rotations fréquentes.`,
    `Rattachée au canton du ${deptName} sous le code postal ${commune.codePostal}, ${commune.nom}${popStr} dispose d'un accès routier adapté à nos véhicules poids lourds pour la livraison et l'enlèvement de bennes.`,
    `${commune.nom} (${commune.codePostal}), commune de ${commune.population?.toLocaleString('fr-FR') || 'quelques centaines d\''} âmes dans le ${deptName}, est intégrée à notre réseau de livraison optimisé pour limiter les coûts de transport et les émissions carbone.`,
    `Notre flotte de camions dessert ${commune.nom} (${commune.codePostal})${popStr} dans des délais courts grâce à notre implantation stratégique dans le département du ${deptName}. Les chantiers locaux bénéficient d'un suivi logistique dédié.`
  ];

  // 1. DYNAMIC INTRO PARAGRAPHS (7 variants per tier per category)
  const intros: Record<string, Record<string, string[]>> = {
    main: {
      XS: [
        `Pour vos chantiers de rénovation ou de désencombrement à ${commune.nom}${popStr}, petit bourg rural du département du ${deptName}, louer une benne simplifie grandement la gestion de vos déchets. Que ce soit pour vider une grange, restaurer un corps de ferme ou désencombrer une habitation, notre service de pose à domicile vous évite de longs et fatigants trajets vers les déchetteries éloignées du secteur.`,
        `À ${commune.nom}${popStr}, au cœur des paysages préservés du ${deptName}, la gestion des déchets encombrants et des matériaux de chantier nécessite une logistique adaptée. Notre agence livre des bennes de 8m³ à 30m³ directement chez les particuliers et agriculteurs de la commune, assurant un traitement respectueux de l'environnement local.`,
        `Si vous entreprenez des travaux sur votre propriété à ${commune.nom}${popStr}, la location de benne constitue la solution idéale pour évacuer de grands volumes en une seule fois. Nos camions accèdent facilement aux voies rurales et allées privatives de la commune pour déposer la benne au plus près de vos besoins.`,
        `Les habitants de ${commune.nom}${popStr} qui se lancent dans des travaux de maçonnerie, de couverture ou d'élagage trouvent dans notre service de location de benne une réponse logistique adaptée à la ruralité de leur commune. Nous assurons la dépose sur terrain privé sans contrainte administrative.`,
        `Dans les communes rurales comme ${commune.nom}${popStr}, la distance avec la déchetterie la plus proche rend la location de benne particulièrement pertinente. Un seul appel suffit pour recevoir un caisson de 8m³ à 30m³ livré directement devant votre porte dans le département du ${deptName}.`,
        `Que vous rénoviez une longère, démolissiez un appentis ou défrichiez un terrain à ${commune.nom}${popStr}, nos bennes de chantier sont conçues pour les accès étroits et les sols non stabilisés typiques des communes rurales du ${deptName}.`,
        `La location de benne à ${commune.nom}${popStr} reste la solution la plus économique et la plus écologique pour évacuer vos déchets de chantier. Notre engagement : une benne livrée sous 48 heures dans toutes les communes du ${deptCode}, y compris les plus excentrées.`
      ],
      S: [
        `À ${commune.nom}${popStr}, commune pavillonnaire et dynamique du ${deptName}, les travaux d'embellissement de l'habitat et de jardinage sont nombreux. Louer une benne à ${commune.nom} permet de rassembler et de faire enlever rapidement tous vos gravats, vieux meubles ou branchages en toute simplicité, sans saturer les infrastructures de collecte locales.`,
        `Les résidents de ${commune.nom}${popStr} bénéficient d'un service de location de benne réactif et de proximité pour tous leurs projets de bricolage ou de déménagement. Nous mettons à disposition des bennes adaptées aux zones résidentielles, facilitant l'évacuation propre de vos encombrants mélangés ou de vos déchets de rénovation.`,
        `Pour simplifier vos travaux de rénovation de maison ou d'appartement à ${commune.nom}${popStr}, la dépose d'une benne tout-venant ou gravats dans votre allée est la formule la plus pratique. Notre flotte dessert l'ensemble des quartiers de la commune pour garantir des rotations rapides.`,
        `Les particuliers et artisans de ${commune.nom}${popStr} font régulièrement appel à nos services de location de benne pour gérer efficacement les débris de leurs chantiers résidentiels. Nous garantissons la conformité du tri et du traitement des matériaux collectés sur votre commune.`,
        `Besoin de vider un garage, de refaire une salle de bain ou d'abattre une cloison à ${commune.nom}${popStr} ? Notre service de location de benne couvre toute la commune avec des tarifs adaptés aux chantiers de taille moyenne.`,
        `${commune.nom}${popStr} connaît un dynamisme immobilier soutenu, générant une forte demande en solutions d'évacuation de déchets. Nos bennes de 8m³ à 30m³ s'adaptent à tous les profils de chantier résidentiel de la commune.`,
        `La location de benne à ${commune.nom}${popStr} est devenue un réflexe pour les particuliers exigeants qui souhaitent un chantier propre et une évacuation conforme. Nous livrons sous 24 à 48 heures dans tous les quartiers de la commune.`
      ],
      M: [
        `La ville de ${commune.nom}${popStr} connaît une activité de rénovation constante, tant pour les habitations que pour les commerces locaux. Pour accompagner ces chantiers, nous proposons aux professionnels et aux particuliers un service complet de location de bennes, de la livraison du contenant jusqu'à la valorisation finale des déchets en centre agréé du ${deptName}.`,
        `Située dans le bassin urbain du ${deptName}, la commune de ${commune.nom}${popStr} requiert une logistique de tri stricte pour les chantiers de construction ou d'aménagement. Nos bennes de 8 à 30 mètres cubes permettent de trier efficacement les métaux, le bois, le plâtre et le plastique directement à la source.`,
        `À ${commune.nom}${popStr}, évacuer des volumes importants de résidus de démolition ou d'encombrants professionnels devient simple. Notre service assure la pose, le retrait rapide sous 24h et la fourniture des bordereaux de suivi des déchets pour une conformité réglementaire absolue.`,
        `Les entreprises du BTP et les copropriétés de ${commune.nom}${popStr} nous confient régulièrement la gestion de leurs flux de déchets de chantier. Nos bennes permettent de centraliser les matériaux à trier et de réduire l'empreinte environnementale des chantiers urbains.`,
        `${commune.nom}${popStr}, avec ses nombreux programmes de construction et de réhabilitation, génère un besoin constant en bennes de tri. Notre maillage de transporteurs dans le ${deptCode} garantit une réactivité de livraison inférieure à 24 heures sur cette commune.`,
        `La densité urbaine de ${commune.nom}${popStr} exige des solutions d'évacuation professionnelles et réglementaires. Nos bennes accompagnent aussi bien les démolitions partielles de bâtiments que les débarras de locaux commerciaux dans le strict respect des normes environnementales.`,
        `Pour les chantiers de rénovation énergétique ou de restructuration d'immeubles à ${commune.nom}${popStr}, nous fournissons des bennes adaptées à chaque flux de déchets (inertes, DIB, bois) afin de maximiser le taux de valorisation et de minimiser les coûts de traitement.`
      ],
      L: [
        `En tant que pôle urbain majeur ou grande métropole du ${deptName}, ${commune.nom}${popStr} concentre d'importants chantiers industriels, commerciaux et résidentiels. Notre service de location de bennes y répond avec une réactivité maximale, un large catalogue de volumes (jusqu'à 30m³) et un accompagnement complet pour la gestion environnementale de vos chantiers.`,
        `Au sein du tissu urbain dense de ${commune.nom}${popStr}, la gestion réglementaire des déchets de chantier (DIB, gravats inertes, bois) exige une logistique sans faille. Nous assurons la mise à disposition rapide de bennes de tri et le transport sécurisé vers les filières de valorisation agréées de la région Hauts-de-France.`,
        `Face aux enjeux de transition écologique à ${commune.nom}${popStr}, notre entreprise aide les maîtres d'œuvre et les particuliers à valoriser leurs volumes de déchets. Nous desservons tous les arrondissements et quartiers industriels de la commune pour des évacuations de bennes fluides.`,
        `${commune.nom}${popStr} impose des standards élevés en matière de gestion des déchets de chantier. En tant que prestataire spécialisé, nous proposons des solutions de bennes sur mesure avec bordereau de suivi, rapports de valorisation et conformité ICPE.`,
        `La métropole de ${commune.nom}${popStr} génère des milliers de tonnes de déchets de construction chaque année. Notre flotte de camions multi-bennes assure des rotations rapides pour maintenir vos chantiers propres et conformes aux exigences du Plan Régional de Prévention et Gestion des Déchets.`,
        `Dans l'agglomération de ${commune.nom}${popStr}, les délais de mise à disposition des bennes sont un enjeu crucial pour la productivité des chantiers. Nos équipes logistiques garantissent une livraison en J+1 et un enlèvement sur simple appel téléphonique.`,
        `Pour les projets de déconstruction sélective ou les chantiers de réhabilitation urbaine à ${commune.nom}${popStr}, nous déployons des bennes multi-flux permettant de séparer les inertes, le bois, les métaux et le plâtre pour une valorisation optimale dans le ${deptName}.`
      ]
    },
    gravats: {
      XS: [
        `Évacuer des gravats inertes comme du béton armé, des briques ou des tuiles à ${commune.nom} nécessite des bennes robustes. Vu le profil rural de la commune, le stationnement sur votre terrain privé facilite la pose d'une benne de 8m³ pour vos démolitions de murs ou de dalles.`,
        `Pour vos travaux de terrassement ou de réfection de toiture à ${commune.nom}, nous livrons des bennes spécifiquement renforcées pour les matériaux lourds. Idéal pour les anciennes bâtisses de campagne de la commune.`,
        `Le déblaiement de terre, cailloux ou carrelage à ${commune.nom} s'effectue sans effort avec notre service de location. Nous déposons une benne de taille moyenne, évitant d'endommager les chemins d'accès locaux.`,
        `Dans un bourg comme ${commune.nom}, les travaux de démolition de murets en pierre ou de fondations en béton génèrent des volumes importants de gravats. Notre benne renforcée de 8m³ supporte le poids de ces matériaux denses sans difficulté.`,
        `La rénovation des vieilles bâtisses en briques typiques du ${deptName} à ${commune.nom} produit des quantités considérables de gravats. Notre service gère le transport de ces inertes vers les filières de concassage routier agréées.`,
        `Pour vos projets de terrassement de jardin ou de création d'allée à ${commune.nom}, la benne gravats est le contenant adapté. Nos chauffeurs connaissent les accès de la commune et déposent le caisson au point le plus pratique.`,
        `L'évacuation de dalles de béton fissurées ou de carrelage cassé à ${commune.nom} ne nécessite qu'une seule rotation de benne 8m³. Nous assurons le recyclage de ces matériaux en granulats pour la construction routière.`
      ],
      S: [
        `Nos bennes à gravats de 8m³ sont idéales pour les chantiers de dallage ou de rénovation à ${commune.nom}. Nos chauffeurs accèdent aisément aux allées résidentielles de la commune pour y déposer votre benne à gravats propres.`,
        `À ${commune.nom}, évacuez proprement briques, tuiles et restes de ciment. Louer une benne à gravats évite de surcharger votre véhicule et préserve la propreté de votre quartier durant vos travaux.`,
        `Simplifiez le retrait de vos déchets inertes à ${commune.nom} avec une benne de 8m³ (capacité maximale autorisée pour le transport de matériaux très lourds et denses comme la terre ou le béton).`,
        `Les maisons individuelles de ${commune.nom} font régulièrement l'objet de travaux de rénovation de façade ou de toiture, générant des volumes importants de tuiles et de parpaings. Notre benne gravats les recueille pour un recyclage efficace.`,
        `Le carrelage, le ciment et les briques issues de vos rénovations à ${commune.nom} doivent être évacués dans des bennes dédiées aux inertes. Cette séparation à la source réduit significativement votre facture de traitement.`,
        `Pour la création ou l'agrandissement de votre piscine à ${commune.nom}, la benne 8m³ est le choix idéal pour évacuer la terre excavée et les résidus de maçonnerie en toute conformité réglementaire.`,
        `Notre service de location de benne à gravats dessert tous les quartiers de ${commune.nom}. Le caisson renforcé en acier de 8m³ est dimensionné pour les charges les plus lourdes sans risque de déformation.`
      ],
      M: [
        `Les rénovations immobilières à ${commune.nom} génèrent des volumes conséquents de briques et de carrelage. Nos bennes à gravats sont positionnées sur vos chantiers urbains pour recueillir ces matériaux valorisables en filière de recyclage locale.`,
        `Pour le terrassement de votre terrain ou l'évacuation de dalles en béton à ${commune.nom}, louez une benne gravats de 8m³. Nous assurons un transport sécurisé et le respect de la charge utile autorisée sur la voirie.`,
        `Notre agence dessert tous les quartiers de ${commune.nom} pour livrer des bennes destinées aux gravats propres ou mélangés (béton, tuile, ardoise, parpaing) issus de vos démolitions.`,
        `Les chantiers de ravalement de façade et de restructuration d'immeubles à ${commune.nom} produisent des flux réguliers de gravats inertes. Nos rotations de bennes renforcées sont programmées selon le rythme de votre chantier.`,
        `À ${commune.nom}, la séparation des gravats inertes des autres déchets de chantier est une obligation réglementaire qui vous fait économiser jusqu'à 40% sur les frais de traitement en décharge professionnelle.`,
        `Nos bennes gravats à ${commune.nom} sont systématiquement acheminées vers des plateformes de concassage où le béton et les tuiles sont transformés en sous-couche routière. Un geste économique et écologique pour vos chantiers urbains.`,
        `Les promoteurs immobiliers et artisans maçons de ${commune.nom} bénéficient de tarifs préférentiels sur nos bennes à gravats grâce à nos contrats de volume avec les carrières de recyclage de la région.`
      ],
      L: [
        `À ${commune.nom}, les contraintes de voirie imposent une grande précision pour la pose de bennes à gravats lourds. Nos camions équipés déposent des bennes de 8m³ sur vos chantiers de déconstruction urbaine en toute sécurité.`,
        `La gestion des gravats inertes de chantiers de grande envergure à ${commune.nom} nécessite une rotation fluide. Nous fournissons des bennes renforcées et assurons des collectes programmées vers les exutoires agréés du ${deptName}.`,
        `Que ce soit pour de la démolition de structures en béton ou le déblaiement de voirie à ${commune.nom}, nous livrons le matériel réglementaire nécessaire pour transporter vos inertes sans risque d'amende pour surcharge.`,
        `Les grands chantiers de déconstruction à ${commune.nom} requièrent un flux tendu de bennes à gravats. Notre service de rotation programmée garantit qu'une benne vide est toujours disponible quand la précédente est pleine.`,
        `Dans l'agglomération de ${commune.nom}, les exigences de tri des inertes sont contrôlées par les services de police des chantiers. Nos bennes gravats sont conformes aux normes de poids et de signalisation en vigueur.`,
        `Pour les opérations de curage de bâtiments ou de démantèlement de parkings à ${commune.nom}, nos bennes 8m³ renforcées supportent jusqu'à 10 tonnes de béton armé, le tout avec un bordereau de traçabilité complet.`,
        `L'agglomération de ${commune.nom} dispose de plusieurs centres de recyclage des inertes. En choisissant notre service, vous bénéficiez de tarifs négociés avec ces installations pour un coût de traitement au plus juste.`
      ]
    },
    encombrants: {
      XS: [
        `Le débarras d'une maison de campagne ou d'une dépendance agricole à ${commune.nom} produit de grandes quantités d'objets hétéroclites. Louer une benne encombrants de 10m³ à 20m³ permet de trier et de jeter tout le mobilier dégradé en une seule rotation.`,
        `Pour vider une habitation suite à une vente ou un sinistre à ${commune.nom}, la benne tout-venant est la solution de facilité. Vous y déposez matelas, cartons et vieux appareils sans tri fastidieux préalable.`,
        `Notre service de location de benne à ${commune.nom} vous permet de désencombrer votre grenier ou grange en un temps record, avec un dépôt sur votre terrain adapté aux camions de livraison.`,
        `Les successions et les déménagements à ${commune.nom} génèrent souvent des volumes surprenants d'objets à jeter. Notre benne encombrants de 15m³ est dimensionnée pour accueillir le contenu complet d'un petit logement.`,
        `Vous débarrassez un garage ou une cave à ${commune.nom} ? Nos bennes tout-venant acceptent les meubles cassés, la vaisselle, les textiles et tous les objets volumineux non dangereux en un seul chargement.`,
        `La benne encombrants est la solution la plus rapide pour nettoyer un logement vacant à ${commune.nom}. Plus besoin de faire des dizaines de trajets à la déchetterie : tout part en une seule fois.`,
        `Les particuliers de ${commune.nom} qui préparent un vide-maison avant une vente immobilière choisissent nos bennes DIB pour leur simplicité : pas de tri compliqué, on accepte tous les déchets non dangereux.`
      ],
      S: [
        `Lors d'un déménagement ou d'un grand nettoyage de printemps à ${commune.nom}, accumuler des vieux meubles ou cartons est fréquent. Nos bennes encombrants (10m³ à 15m³) se garent facilement devant chez vous dans la commune.`,
        `À ${commune.nom}, évacuez canapés, literies et électroménagers usagés grâce à notre benne DIB non dangereux pour particuliers. Nous recyclons au maximum le bois et le plastique collectés.`,
        `Vous videz une habitation familiale ou procédez à une succession à ${commune.nom} ? Une benne tout-venant de grand volume simplifie les manipulations et centralise tous vos déchets.`,
        `Le renouvellement du mobilier d'une maison à ${commune.nom} ne doit pas devenir un casse-tête logistique. Notre benne encombrants se pose dans votre allée le temps nécessaire pour charger tout l'ancien mobilier.`,
        `Les résidents de ${commune.nom} apprécient notre formule tout inclus : livraison de la benne, stationnement de 5 jours, enlèvement et tri en centre agréé. Aucune surprise sur la facture finale.`,
        `Pour un débarras efficace à ${commune.nom}, combinez notre benne encombrants avec notre service de conseil : nous vous aidons à choisir le bon volume pour éviter les rotations inutiles et les surcoûts.`,
        `Les associations caritatives de ${commune.nom} ne peuvent pas toujours récupérer vos vieux meubles. Pour tout ce qui n'est plus réutilisable, notre benne tout-venant est la solution de recyclage responsable.`
      ],
      M: [
        `Les entreprises et les particuliers de ${commune.nom} font appel à nos services pour le débarras de bureaux ou d'appartements. Nos bennes encombrants collectent tout le mobilier obsolète et les archives à détruire.`,
        `Pour désencombrer des entrepôts ou des locaux commerciaux à ${commune.nom}, nous livrons des bennes de 15m³ à 20m³ adaptées à vos volumes de déchets mixtes non dangereux.`,
        `Le traitement des encombrants à ${commune.nom} passe par des centres de tri haute performance. En louant notre benne, vous garantissez la valorisation matière de vos meubles et emballages.`,
        `Les copropriétés de ${commune.nom} organisent régulièrement des opérations de débarras collectif. Notre benne de 20m³ placée dans la cour de l'immeuble facilite la participation de tous les résidents.`,
        `La rénovation d'un local commercial à ${commune.nom} implique souvent l'évacuation de mobilier d'agencement, de présentoirs et d'éléments de décoration. Notre benne DIB est parfaite pour ce type de déchets mélangés.`,
        `Les gestionnaires immobiliers de ${commune.nom} nous sollicitent pour les remises en état de logements entre deux locataires. Notre benne encombrants permet de faire place nette rapidement et proprement.`,
        `À ${commune.nom}, le tri sélectif des encombrants est valorisé : le bois part en filière bois-énergie, les métaux sont refondus, les plastiques sont broyés. Votre benne tout-venant contribue à l'économie circulaire locale.`
      ],
      L: [
        `Pour les opérations de vidage de grands bâtiments ou de commerces à ${commune.nom}, la réactivité logistique est primordiale. Nous mettons à disposition des bennes de 20m³ à 30m³ avec des portes arrière pour faciliter le chargement manuel.`,
        `La gestion des flux d'encombrants urbains à ${commune.nom} requiert des bennes de grand volume. Nous gérons le transport sécurisé dans les centres de valorisation de l'agglomération pour maximiser le recyclage.`,
        `Nos bennes pour tout-venant et encombrants s'adaptent aux contraintes d'accès des immeubles et zones tertiaires de ${commune.nom}, avec des rotations rapides selon vos plannings de chantiers.`,
        `Les grands déstockages commerciaux et les fermetures de magasins à ${commune.nom} génèrent des dizaines de mètres cubes de mobilier et de PLV. Nos bennes de 30m³ à porte battante sont la solution logistique optimale.`,
        `La métropole de ${commune.nom} impose des horaires de livraison stricts en centre-ville. Nos équipes logistiques planifient les déposes de bennes encombrants en créneaux autorisés pour éviter les verbalisations.`,
        `Pour les chantiers de réhabilitation de bureaux à ${commune.nom}, nous proposons des bennes multi-rotations : une benne pleine est enlevée et remplacée par une benne vide dans la même demi-journée.`,
        `Les centres de tri de l'agglomération de ${commune.nom} utilisent des technologies de séparation optique pour valoriser jusqu'à 70% des déchets encombrants collectés dans nos bennes.`
      ]
    },
    'dechets-verts': {
      XS: [
        `L'entretien des grands jardins ou l'élagage de haies arborées à ${commune.nom} génère de très importants volumes de végétaux. Rappelons que le brûlage des déchets verts à l'air libre est interdit par arrêté préfectoral dans le ${deptCode} (passible d'une amende de 450 €). Notre benne paysagère est l'alternative écologique indispensable.`,
        `Pour valoriser vos tailles d'arbres, souches et tontes à ${commune.nom}, louez une benne verte. Nous transportons vos déchets végétaux vers des plateformes de compostage industriel du département.`,
        `Évitez les multiples trajets en remorque vers la déchetterie locale depuis ${commune.nom}. Notre benne de 15m³ accueille toutes vos branches et feuillages en une seule fois.`,
        `Dans les communes rurales comme ${commune.nom}, l'entretien de grands terrains boisés produit des volumes considérables de branchages. Notre benne paysagère est dimensionnée pour les tronçons de branches de grande longueur.`,
        `Le débroussaillage réglementaire des parcelles à ${commune.nom} est obligatoire pour la prévention des risques. Notre benne déchets verts vous permet de respecter cette obligation sans brûlage interdit.`,
        `Les paysagistes intervenant à ${commune.nom} optimisent leurs chantiers en réservant une benne déchets verts sur site. Fini les allers-retours en camionnette vers la plateforme de compostage.`,
        `Le défrichage d'un terrain en friche à ${commune.nom} peut générer 15 à 20 m³ de végétaux. Notre benne paysagère de grande capacité est la solution pour évacuer ronces, arbustes et herbes hautes en une seule rotation.`
      ],
      S: [
        `À ${commune.nom}, commune verdoyante, l'entretien paysager produit de gros tas de branches. Louer une benne à déchets verts vous garantit une évacuation conforme, sans risque de contravention pour brûlage sauvage.`,
        `Notre benne paysagère de 10m³ à 15m³ se dépose facilement dans les allées des résidences de ${commune.nom}. Parfait pour les travaux saisonniers d'élagage ou de débroussaillage.`,
        `Valorisez vos branchages et gazons coupés à ${commune.nom} en louant une benne spécifique. Vos déchets de jardin seront transformés en compost agricole local.`,
        `Les lotissements de ${commune.nom} génèrent au printemps et en automne des pics de demande pour nos bennes déchets verts. Réservez en avance pour garantir votre créneau de livraison saisonnier.`,
        `Le taillage de haies et l'abattage de petits arbres à ${commune.nom} remplissent rapidement une benne de 10m³. Pour les gros chantiers d'élagage, nous recommandons le modèle 15m³ plus adapté.`,
        `Depuis ${commune.nom}, vos déchets verts sont acheminés vers la plateforme de compostage la plus proche dans le ${deptCode}. Le compost produit est ensuite redistribué aux agriculteurs et maraîchers locaux.`,
        `En combinant tonte de pelouse et taille de haie à ${commune.nom}, vous pouvez remplir une benne de 10m³ en une journée de travail. Nous conseillons de ne pas tasser les végétaux pour faciliter le compostage.`
      ],
      M: [
        `Les paysagistes et copropriétés de ${commune.nom} font régulièrement appel à nos bennes pour évacuer les souches et les branches. La benne verte permet de maintenir les chantiers propres et sécurisés.`,
        `À ${commune.nom}, les résidus de tonte de pelouse ou d'abattage d'arbres sont acheminés vers des filières de valorisation biologique. Louer une benne dédiée évite de souiller les bennes tout-venant.`,
        `Nous livrons des bennes paysagères de 15m³ à 20m³ à ${commune.nom} pour toutes vos opérations d'entretien d'espaces verts d'entreprises ou de parcs privatifs.`,
        `Les syndics de copropriété de ${commune.nom} nous confient l'évacuation des résidus d'entretien de leurs espaces verts communs. Notre benne dédiée garantit un traitement distinct des déchets ménagers.`,
        `L'abattage d'arbres malades ou dangereux à ${commune.nom} exige une évacuation rapide des troncs et branchages pour libérer la voie publique. Nous intervenons en urgence avec des bennes de 15m³ ou plus.`,
        `Les collectivités locales de ${commune.nom} nous consultent pour l'évacuation des déchets verts après les tempêtes hivernales. Nos bennes paysagères de grand format gèrent les volumes exceptionnels de branches cassées.`,
        `À ${commune.nom}, la filière de valorisation des déchets verts est particulièrement bien structurée. Vos végétaux collectés sont transformés en compost normé NF U 44-051, utilisable en agriculture biologique.`
      ],
      L: [
        `L'entretien des parcs publics et des jardins urbains à ${commune.nom} demande un traitement de gros volumes végétaux. Nos bennes paysagères de 30m³ permettent d'évacuer des tonnes de branches en un minimum de rotations.`,
        `Pour vos chantiers de création de parcs ou de déboisage à ${commune.nom}, nous assurons des rotations régulières de bennes à végétaux, en lien avec les plateformes de compostage de la métropole.`,
        `Nous accompagnons les professionnels du paysage à ${commune.nom} avec un service de location de benne flexible, garantissant la traçabilité écologique de vos déchets de coupe.`,
        `Les services d'espaces verts de la ville de ${commune.nom} utilisent nos bennes paysagères pour les campagnes d'élagage massif le long des boulevards et dans les parcs urbains de l'agglomération.`,
        `La métropole de ${commune.nom} impose le compostage ou la méthanisation de tous les déchets verts collectés. Nos bennes alimentent les usines de biogaz locales qui produisent de l'énergie renouvelable à partir de vos végétaux.`,
        `Pour les chantiers de création d'espaces paysagers à ${commune.nom}, nos bennes accueillent aussi la terre végétale de surplus et les mottes de gazon découpé pour un acheminement vers les plateformes de redistribution.`,
        `L'entretien des berges et des zones humides à ${commune.nom} génère des flux spécifiques de déchets verts. Nos bennes sont adaptées au transport de roseaux, joncs et végétation aquatique vers les filières de valorisation appropriées.`
      ]
    },
    dib: {
      XS: [
        `Le tri des déchets industriels banals (bois, métaux, cartons, plastiques) sur vos chantiers à ${commune.nom} est essentiel pour limiter vos coûts de traitement. La benne DIB mélangé est adaptée pour les rénovations de fermettes ou de granges.`,
        `Pour évacuer vos résidus de chantiers de construction ou de charpente à ${commune.nom}, la benne DIB vous évite d'enfouir des matériaux recyclables. Idéal pour séparer le bois brut des autres déchets non dangereux.`,
        `Nos bennes DIB livrées à ${commune.nom} facilitent l'évacuation des métaux, isolants et emballages plastiques pour les artisans du bâtiment exerçant en zone rurale.`,
        `Les chantiers de second œuvre dans les habitations anciennes de ${commune.nom} produisent un mélange de plâtre, de bois et de plastique qui relève de la catégorie DIB. Notre benne adaptée collecte ces matériaux pour un tri mécanisé.`,
        `À ${commune.nom}, les artisans menuisiers et charpentiers utilisent nos bennes bois pour évacuer les chutes de planches, les palettes usagées et les coffrages qui encombrent leurs chantiers ruraux.`,
        `Le remplacement des menuiseries anciennes à ${commune.nom} génère des volumes de bois, PVC et verre qui doivent être triés en centre agréé. Notre benne DIB centralise ces matériaux pour une valorisation optimale.`,
        `Nos bennes DIB à ${commune.nom} acceptent l'ensemble des déchets non dangereux de vos chantiers : isolants en laine de verre, gaines électriques, tuyaux en cuivre et emballages de matériaux de construction.`
      ],
      S: [
        `Nos bennes DIB de 10m³ à 20m³ à ${commune.nom} sont parfaites pour les artisans en plomberie, électricité ou charpente. Le tri à la source permet de réduire considérablement vos frais de décharge professionnelle.`,
        `À ${commune.nom}, facilitez le recyclage des matériaux de second œuvre (plâtre propre, isolants, tuyaux PVC, gaines). Nos bennes DIB accueillent vos mélanges de chantiers résidentiels.`,
        `La location d'une benne DIB à ${commune.nom} simplifie le nettoyage de vos chantiers de construction de maisons individuelles ou d'extensions de bâtiments.`,
        `Les couvreurs et zingueurs de ${commune.nom} apprécient nos bennes DIB pour évacuer les anciennes couvertures en fibrociment non amianté, les gouttières en zinc et les liteaux de toiture.`,
        `Pour vos chantiers d'isolation thermique par l'extérieur à ${commune.nom}, la benne DIB recueille les chutes de polystyrène, les rails métalliques et les emballages de panneaux isolants.`,
        `Les plaquistes et peintres intervenant à ${commune.nom} centralisent leurs déchets dans nos bennes DIB : chutes de plaques BA13, pots de peinture vides, films de protection et bandes à joint usagées.`,
        `À ${commune.nom}, la séparation du bois brut dans une benne dédiée permet de bénéficier d'un tarif de traitement réduit par rapport au DIB mélangé. Notre conseiller vous guide dans le choix optimal.`
      ],
      M: [
        `Le décret 7 flux impose aux entreprises de ${commune.nom} le tri séparé du papier, métal, plastique, verre, bois, fraction minérale et plâtre. Nos bennes DIB sont l'outil idéal pour respecter cette réglementation sur vos chantiers locaux.`,
        `Pour le débarras industriel ou la rénovation de locaux commerciaux à ${commune.nom}, nous proposons des bennes DIB avec suivi rigoureux des déchets et certificats de valorisation pour vos audits RSE.`,
        `Notre service logistique à ${commune.nom} livre des bennes de 15m³ ou 20m³ pour le bois de coffrage, les palettes et les isolants de vos chantiers de moyenne envergure.`,
        `Les entreprises de second œuvre de ${commune.nom} font face à des contrôles renforcés sur la gestion de leurs déchets de chantier. Nos bennes DIB traçées leur fournissent les justificatifs de conformité exigés.`,
        `À ${commune.nom}, les bureaux d'études environnementaux recommandent nos bennes DIB multi-flux pour les chantiers certifiés HQE ou BREEAM. La traçabilité des déchets est un critère clé de ces certifications.`,
        `Notre partenariat avec les centres de tri mécanisé du ${deptName} permet de valoriser plus de 65% des déchets DIB collectés à ${commune.nom}. Les métaux, bois et cartons sont réintégrés dans les filières industrielles.`,
        `Les chantiers de rénovation énergétique des bâtiments tertiaires à ${commune.nom} produisent des flux importants d'anciens isolants et de menuiseries. Nos bennes DIB de 20m³ sont dimensionnées pour ces volumes.`
      ],
      L: [
        `Dans les grands chantiers tertiaires et commerciaux de ${commune.nom}, la traçabilité des déchets DIB est une obligation réglementaire stricte. Nous fournissons des bordereaux de suivi (BSDD) et trions vos déchets en centre de tri agréé.`,
        `Nous mettons en place des bennes DIB de 30m³ pour les usines, plateformes logistiques et gros chantiers de second œuvre à ${commune.nom}, avec un service de rotation sur simple appel téléphonique.`,
        `Optimisez votre gestion de déchets de chantier à ${commune.nom} en choisissant nos bennes DIB tout-venant. Nous assurons la collecte et le tri robotisé pour réintégrer les métaux et cartons dans l'économie circulaire.`,
        `Les ensembles immobiliers en construction à ${commune.nom} bénéficient de notre offre de bennes DIB multi-rotations avec planning de collecte hebdomadaire adapté à l'avancement du chantier.`,
        `La réglementation ICPE applicable aux grands chantiers de ${commune.nom} exige un suivi précis des tonnages de DIB produits. Nos bennes équipées de pesée embarquée fournissent des données exactes pour vos reporting environnementaux.`,
        `Les promoteurs immobiliers de ${commune.nom} nous consultent dès la phase conception pour dimensionner les besoins en bennes DIB du chantier. Cette anticipation permet d'optimiser les coûts de gestion des déchets de construction.`,
        `Dans l'agglomération de ${commune.nom}, nos bennes DIB alimentent le centre de tri automatisé équipé de capteurs infrarouges qui séparent les plastiques, les bois, les métaux et les papiers pour une valorisation maximale.`
      ]
    }
  };

  // 2. DYNAMIC LOGISTICS / REGULATORY WARNINGS (7 variants per tier)
  const logistics: Record<string, string[]> = {
    XS: [
      `Dans une commune rurale comme ${commune.nom}, les voies d'accès sont souvent dégagées mais parfois étroites (chemins de terre, ponts à charge limitée). Veuillez vérifier que notre camion poids lourd (3m de large, 19T) peut manœuvrer. Pour un dépôt sur la voie publique, une déclaration préalable auprès de la mairie de ${commune.nom} est conseillée.`,
      `Pour un dépôt sur terrain privé à ${commune.nom}, aucune démarche n'est requise. Si la benne doit empiéter sur un chemin communal, veillez à prévenir le secrétariat de mairie au moins 3 jours à l'avance pour éviter tout blocage de tracteurs ou de véhicules de secours.`,
      `Le sol de votre terrain à ${commune.nom} doit être stable pour supporter le poids de la benne chargée (surtout pour les gravats). Si la pose s'effectue sur la chaussée publique rurale, vérifiez les arrêtés locaux de circulation auprès des services municipaux.`,
      `L'accès au chantier à ${commune.nom} doit permettre le passage d'un camion de 10 mètres de long. Si votre propriété est desservie par un chemin agricole, signalez-le lors de votre demande de devis pour que nous adaptions notre véhicule de livraison.`,
      `À ${commune.nom}, les dépôts de benne sur terrain privé ne nécessitent aucune autorisation. Nous recommandons de placer des planches sous les vérins du camion pour protéger les surfaces en herbe ou en gravier de votre propriété.`,
      `Les chemins communaux de ${commune.nom} peuvent être soumis à des restrictions de tonnage. Si vous constatez des panneaux de limitation de poids, informez-nous avant la livraison pour que nous vérifions la faisabilité de l'accès.`,
      `Avant la livraison de votre benne à ${commune.nom}, assurez-vous que l'emplacement prévu est dégagé de tout obstacle (véhicule, haie débordante, portail trop étroit). Un espace libre de 6 mètres de long et 3 mètres de large est nécessaire.`
    ],
    S: [
      `À ${commune.nom}, le stationnement dans les zones pavillonnaires est réglementé. Pour poser une benne sur la voie publique, une demande d'Autorisation d'Occupation Temporaire (AOT) doit être soumise à la mairie de ${commune.nom} 5 jours ouvrés à l'avance. Pensez à prévoir des cônes de signalisation si la benne déborde.`,
      `Si vous disposez d'une cour ou d'un jardin à ${commune.nom}, nos chauffeurs peuvent y déposer la benne pour vous éviter des formalités administratives. Pour un dépôt sur un trottoir ou une place de stationnement, le formulaire de voirie de la commune est obligatoire.`,
      `La mairie de ${commune.nom} exige un arrêté de circulation si la benne perturbe le passage des bus ou des riverains. Contactez le service urbanisme de la commune pour valider l'emplacement de voirie choisi.`,
      `Dans les quartiers résidentiels de ${commune.nom}, la pose de benne devant votre garage est la solution la plus courante. Si la benne empiète sur le trottoir, une autorisation préalable de la commune est nécessaire pour éviter toute amende.`,
      `À ${commune.nom}, les places de stationnement devant votre habitation peuvent être utilisées pour poser une benne, sous réserve d'obtenir un arrêté municipal d'interdiction de stationner. Nous pouvons vous accompagner dans cette démarche.`,
      `Le dépôt de benne dans une impasse ou une voie sans issue de ${commune.nom} nécessite une attention particulière à la manœuvre du camion. Signalez ce type de configuration lors de votre réservation pour garantir un accès sûr.`,
      `Les règles de voirie à ${commune.nom} prévoient un balisage obligatoire (cônes et bandes réfléchissantes) si la benne stationne sur la chaussée de nuit. Nous fournissons le matériel de signalisation nécessaire avec chaque livraison.`
    ],
    M: [
      `Les contraintes de circulation urbaine à ${commune.nom} imposent des règles strictes. L'autorisation d'occupation temporaire (AOT) du domaine public doit être demandée auprès des services techniques de la mairie de ${commune.nom} (délai de 7 à 10 jours). Un balisage nocturne de la benne est requis s'il y a empiètement sur la chaussée.`,
      `À ${commune.nom}, les dépôts sur les places de parking payantes nécessitent de s'acquitter des droits de stationnement municipaux. Rapprochez-vous de la mairie pour obtenir l'arrêté temporaire d'interdiction de stationner pour réserver l'emplacement du camion.`,
      `Le dépôt de benne sur le domaine public à ${commune.nom} implique la responsabilité du demandeur. Assurez-vous d'avoir obtenu l'accord écrit de la municipalité avant notre livraison pour éviter des amendes de voirie.`,
      `Les zones piétonnes et les secteurs sauvegardés de ${commune.nom} peuvent imposer des horaires de livraison restreints (généralement avant 8h ou après 18h). Renseignez-vous auprès du service voirie de la mairie avant de réserver.`,
      `À ${commune.nom}, le stationnement d'une benne à proximité d'un carrefour ou d'un passage piéton est interdit. Nous identifions avec vous l'emplacement le plus approprié en respectant les distances réglementaires de sécurité.`,
      `Les chantiers situés en zone de rénovation urbaine à ${commune.nom} peuvent bénéficier de dérogations spécifiques pour le stationnement de bennes. Le coordinateur SPS de votre chantier peut faciliter l'obtention de ces autorisations.`,
      `Nos chauffeurs connaissent les contraintes de circulation de ${commune.nom} et adaptent leurs itinéraires pour éviter les sens uniques, les rues étroites et les zones à gabarit limité de la ville.`
    ],
    L: [
      `Dans l'agglomération très dense de ${commune.nom}, les règles de voirie sont drastiques. Une demande d'arrêté de stationnement et d'autorisation de voirie doit être déposée en mairie de ${commune.nom} au moins 15 jours à l'avance. Le balisage réfléchissant et le respect des couloirs de bus et pistes cyclables sont contrôlés par la police municipale.`,
      `À ${commune.nom}, la pose en hypercentre nécessite des camions adaptés ou des livraisons en horaires décalés pour ne pas bloquer les flux de circulation. L'obtention de l'autorisation municipale de voirie est indispensable avant de planifier la dépose.`,
      `Les chantiers urbains à ${commune.nom} doivent respecter la charte locale des chantiers (bruit, poussière, sécurité). Prévoyez des plaques de protection pour le sol (trottoirs fragiles) et assurez-vous d'avoir le numéro d'arrêté municipal affiché sur la benne.`,
      `La métropole de ${commune.nom} dispose d'un guichet unique pour les autorisations de voirie. Déposez votre demande en ligne sur le portail de la collectivité au minimum 10 jours ouvrés avant la date de livraison souhaitée.`,
      `Les zones à faibles émissions (ZFE) de ${commune.nom} imposent des restrictions de circulation pour certains véhicules poids lourds. Nos camions sont conformes aux normes Euro 6 et disposent de la vignette Crit'Air nécessaire.`,
      `En centre-ville de ${commune.nom}, les livraisons de bennes sont soumises à des créneaux horaires stricts (6h-9h ou 14h-16h selon les arrondissements). Nous planifions chaque dépose en fonction des contraintes de votre quartier.`,
      `Les services de voirie de ${commune.nom} peuvent exiger un état des lieux photographique du trottoir avant et après la dépose de la benne. Nous réalisons ce constat systématiquement pour vous protéger de tout litige avec la collectivité.`
    ]
  };

  // 3. DYNAMIC USE CASES (7 variants per category)
  const useCases: Record<string, string[]> = {
    main: [
      `évacuer tous vos déchets de chantier ou encombrants lors de rénovations de maisons individuelles ou de locaux commerciaux.`,
      `désencombrer de grands volumes accumulés dans des habitations, des entrepôts ou des dépendances professionnelles du Nord.`,
      `gérer proprement le tri de vos chantiers de construction, d'extension de maison ou d'aménagement extérieur.`,
      `centraliser et trier les déchets de vos travaux de rénovation intérieure : plâtre, carrelage, menuiseries et sanitaires.`,
      `évacuer rapidement les débris d'une démolition partielle ou d'un curage de bâtiment en fin de vie.`,
      `organiser un vide-maison complet lors d'une succession ou d'un déménagement avec une solution tout-en-un.`,
      `nettoyer un terrain après des travaux de terrassement, de VRD ou de raccordement aux réseaux.`
    ],
    gravats: [
      `stocker et transporter le béton armé, les parpaings, le carrelage et les tuiles issus de démolitions de murs ou de toitures.`,
      `évacuer les surplus de terre végétale brute, de cailloux et de pierres lors de vos travaux de terrassement et de création de piscine.`,
      `rassembler les résidus inertes de chantiers de maçonnerie pour les envoyer en centre de recyclage et concassage routier.`,
      `collecter les dalles de béton fissurées, les bordures de jardin et les blocs de fondation pour un recyclage en granulats.`,
      `centraliser les déblais de fouilles et les excédents de terre minérale issus de vos travaux d'assainissement ou de drainage.`,
      `évacuer les cheminées démontées, les escaliers en pierre et les éléments de maçonnerie lourde après un curage de bâtiment.`,
      `regrouper les restes de carrelage, de faïence et de céramique sanitaire pour un traitement en filière inerte agréée.`
    ],
    encombrants: [
      `débarrasser les meubles anciens, électroménagers usagés, matelas et cartons lors d'un déménagement, d'un vide-maison ou d'une succession.`,
      `évacuer tous les déchets hétéroclites et volumineux accumulés dans vos caves, greniers ou garages personnels.`,
      `nettoyer des locaux professionnels après un changement de mobilier ou la fermeture d'un point de vente local.`,
      `vider un appartement ou une maison après le départ d'un locataire en y déposant tout le mobilier abandonné.`,
      `préparer un bien immobilier pour la vente en évacuant tous les objets encombrants qui nuisent à la présentation.`,
      `collecter le mobilier de bureau obsolète, les équipements informatiques déclassés et les archives papier périmées.`,
      `rassembler les jouets cassés, les appareils de sport usagés et les objets de décoration accumulés au fil des années.`
    ],
    'dechets-verts': [
      `regrouper les branches d'arbres, souches, tontes de pelouses et tailles de haies après un grand nettoyage saisonnier de jardin.`,
      `évacuer les résidus d'élagage, d'abattage d'arbres et de débroussaillage de parcelles agricoles ou de copropriétés.`,
      `rassembler les terres de déblais mélangées à des racines ou gazons de placage lors de travaux d'aménagement paysager.`,
      `collecter les résidus de tonte automatique, les feuilles mortes et les mousses raclées de votre toiture ou terrasse.`,
      `centraliser les souches d'arbres déracinées, les troncs débités et les grosses branches après un abattage certifié.`,
      `évacuer les ronces, les buissons arrachés et la végétation envahissante lors de la remise en état d'un terrain abandonné.`,
      `regrouper les résidus de haie de thuya, de cyprès ou de laurier après une taille de formation ou de rajeunissement.`
    ],
    dib: [
      `trier le bois de charpente, les métaux, les cloisons en plâtre (BA13) et les plastiques issus de chantiers de second œuvre.`,
      `évacuer les déchets industriels banals mélangés des chantiers d'artisans (peintres, plaquistes, électriciens).`,
      `collecter les chutes de matériaux d'emballage, de cartons et de palettes en bois issus d'activités logistiques ou commerciales.`,
      `centraliser les résidus de pose de menuiseries : films protecteurs, cales en plastique, chutes d'aluminium et joints de vitrage.`,
      `évacuer les anciens isolants thermiques (laine de verre, polystyrène expansé) lors de travaux de rénovation énergétique.`,
      `rassembler les gaines électriques, les tuyaux de plomberie et les chemins de câbles retirés lors d'une mise aux normes.`,
      `collecter les panneaux de particules, les étagères démontées et les habillages en MDF issus d'un réaménagement intérieur.`
    ]
  };

  // 4. DYNAMIC PRICING CONTEXT (7 variants per tier)
  const pricing: Record<string, string[]> = {
    XS: [
      `Les tarifs à ${commune.nom} reflètent les prix moyens du département du ${deptName}. En raison du caractère excentré de la commune, la part du transport du camion peut peser sur la facture. Regrouper vos volumes dans une seule benne est le choix le plus astucieux pour optimiser vos frais.`,
      `Pour la commune de ${commune.nom}, le prix inclut la livraison, 5 jours de location, le retrait et les frais de traitement. Trier vos gravats ou vos déchets végétaux séparément vous permet de bénéficier de tarifs de décharge très avantageux.`,
      `Le prix à ${commune.nom} est calculé au plus juste. En choisissant une benne de taille adaptée (8m³ pour le lourd, 15m³ ou 30m³ pour le léger), vous évitez des rotations inutiles et maîtrisez votre budget de chantier.`,
      `Notre tarification pour ${commune.nom} est transparente et tout compris : aucun supplément pour le kilométrage ou les péages. Seule une éventuelle surcharge en cas de déchets non conformes peut s'ajouter au devis initial.`,
      `À ${commune.nom}, le rapport qualité-prix de nos bennes est optimisé grâce à notre connaissance des itinéraires locaux et à nos partenariats avec les centres de traitement de proximité du ${deptCode}.`,
      `Le tarif forfaitaire que nous proposons à ${commune.nom} couvre l'intégralité de la prestation. Si vous avez besoin de quelques jours supplémentaires de location, un supplément journalier modéré peut être appliqué sur simple demande.`,
      `Nous appliquons à ${commune.nom} le même barème tarifaire que dans les communes environnantes. La transparence de nos prix est une valeur fondamentale : le devis transmis est le montant final que vous réglerez.`
    ],
    S: [
      `À ${commune.nom}, les prix de location sont particulièrement compétitifs en raison de la proximité des axes routiers majeurs du ${deptName}. Nous recommandons de trier vos matériaux à la source (par exemple, uniquement du béton/tuiles ou uniquement des branchages) pour réduire de près de 30% les coûts de décharge professionnelle.`,
      `Les tarifs de location à ${commune.nom} sont stables. Le forfait comprend le transport aller-retour et le traitement en centre agréé. Une prolongation de location au-delà de 5 jours est possible sur simple demande écrite.`,
      `Nos devis pour ${commune.nom} sont transparents et sans frais cachés. Le tarif varie selon la nature du déchet : les bennes de gravats propres ou de bois sont moins chères à traiter que le tout-venant mélangé (DIB).`,
      `La proximité de ${commune.nom} avec les principaux centres de tri du ${deptCode} nous permet de maintenir des tarifs parmi les plus bas du département. Profitez-en en réservant votre benne au moins 48 heures à l'avance.`,
      `À ${commune.nom}, nous proposons des remises pour les locations de plusieurs bennes simultanées. Les artisans qui combinent une benne gravats et une benne DIB bénéficient d'un tarif préférentiel sur la seconde benne.`,
      `Le prix de votre benne à ${commune.nom} dépend aussi de la durée de location souhaitée. Notre forfait standard inclut 5 jours, mais des formules courtes (48h) ou longues (10 jours) sont disponibles pour s'adapter à votre planning.`,
      `Nos tarifs pour ${commune.nom} sont révisés annuellement en fonction de l'évolution de la TGAP (taxe sur les activités polluantes). Nous absorbons une partie de ces augmentations pour maintenir notre compétitivité.`
    ],
    M: [
      `Le coût d'une benne à ${commune.nom} intègre les taxes environnementales locales (TGAP) appliquées dans le bassin métropolitain du ${deptName}. Pour les professionnels, la fourniture des bordereaux de suivi des déchets (BSDD) est incluse d'office dans notre prestation pour garantir votre traçabilité.`,
      `À ${commune.nom}, les tarifs de location s'adaptent à vos contraintes de chantier. Si la benne est posée en zone payante, le coût de réservation de l'emplacement de voirie municipale est à la charge du client.`,
      `Nous proposons des forfaits tout compris pour la ville de ${commune.nom}. Nos partenariats avec les centres de valorisation industrielle de la région Hauts-de-France nous permettent de vous proposer des prix de traitement DIB très attractifs.`,
      `Les entreprises de ${commune.nom} bénéficient de conditions tarifaires spécifiques : contrats de volume, facturation mensuelle et tarifs dégressifs à partir de la troisième benne commandée sur un même chantier.`,
      `À ${commune.nom}, le choix du tri à la source impacte directement votre budget. Une benne de gravats purs coûte en moyenne 30% de moins qu'une benne de DIB mélangé, grâce au différentiel de coût de traitement en décharge.`,
      `Notre politique tarifaire à ${commune.nom} est alignée sur les recommandations de la Fédération Nationale des Activités de la Dépollution et de l'Environnement. Nos prix sont vérifiables et justifiés poste par poste.`,
      `Pour les chantiers de longue durée à ${commune.nom}, nous proposons des abonnements de rotation hebdomadaire ou bimensuelle avec un tarif préférentiel négocié selon le volume global de déchets estimé.`
    ],
    L: [
      `Compte tenu de la forte densité à ${commune.nom}, les tarifs de location intègrent les contraintes logistiques urbaines (temps de parcours, accès restreints). Les prix sont calculés de manière transparente et comprennent le dépôt, le retrait et le tri sélectif en centre de valorisation métropolitain du ${deptName}.`,
      `Les tarifs de location de benne à ${commune.nom} dépendent fortement du respect du tri réglementaire (loi AGEC). Les déchets mélangés non triés subissent des pénalités de décharge importantes, c'est pourquoi nous conseillons d'opter pour des bennes mono-flux (bois, métaux ou carton) lorsque c'est possible.`,
      `À ${commune.nom}, profitez de nos tarifs négociés avec les plus grandes décharges professionnelles de l'agglomération du Nord. Nos conseillers vous aident à choisir la taille de benne idéale pour minimiser vos taxes de mise en décharge.`,
      `Les grands comptes et les promoteurs de ${commune.nom} accèdent à notre grille tarifaire pro avec des réductions significatives sur les rotations multiples et les contrats annuels de gestion des déchets de chantier.`,
      `La logistique en centre-ville de ${commune.nom} impose parfois des livraisons nocturnes ou en horaires décalés. Ces créneaux spécifiques sont soumis à un supplément modéré, intégré de manière transparente dans votre devis.`,
      `À ${commune.nom}, nous offrons un service de conseil gratuit pour optimiser votre budget déchets. Un audit rapide de votre chantier nous permet de recommander le nombre et le type de bennes qui minimisent votre coût global.`,
      `Les tarifs de nos bennes à ${commune.nom} sont compétitifs grâce à notre volume d'activité dans l'agglomération. Notre puissance d'achat auprès des exutoires nous permet de répercuter des économies d'échelle significatives.`
    ]
  };

  // 5. CATEGORY-SPECIFIC FAQS (7 sets for each category instead of shared generic ones)
  const categoryFaqs: Record<string, { question: string; answer: string }[][]> = {
    main: [
      [
        { question: `Combien coûte la location d'une benne à ${commune.nom} ?`, answer: `Le prix moyen d'une benne à gravats (8m³) à ${commune.nom} est d'environ ${prices.gravats}€ HT, tandis qu'une benne DIB mélangé (10m³) commence à environ ${prices.dib}€ HT. Ce tarif comprend la pose du caisson, la location pour quelques jours, le retrait par notre chauffeur et le tri dans le département du ${deptName}.` },
        { question: `Puis-je poser la benne sur la voie publique à ${commune.nom} ?`, answer: tier === 'XS' ? `Dans les petites communes rurales comme ${commune.nom}, le dépôt sur voirie nécessite une déclaration simple auprès du secrétariat de la mairie. Si vous disposez d'un terrain privé, privilégiez-le pour éviter toute démarche.` : `Oui, mais cela nécessite d'obtenir une Autorisation d'Occupation Temporaire (AOT) délivrée par la mairie de ${commune.nom}. Le délai d'instruction varie de 5 à 12 jours. Le dépôt sur propriété privée (cour, jardin, chantier clos) est quant à lui totalement libre et sans formalité.` },
        { question: `Que se passe-t-il si je dépasse le poids limite de la benne ?`, answer: `Pour des raisons de sécurité routière et de préservation de la voirie à ${commune.nom}, nos camions ne peuvent pas transporter de bennes en surcharge. Une benne de gravats ne doit contenir que des inertes et ne pas dépasser le niveau du bord supérieur du caisson.` }
      ],
      [
        { question: `Quel est le délai de livraison d'une benne à ${commune.nom} ?`, answer: tier === 'L' || tier === 'M' ? `Nous intervenons très rapidement sur l'agglomération de ${commune.nom}, avec une livraison sous 24 à 48 heures ouvrées. En période de forte demande (printemps et automne), nous conseillons de bloquer votre créneau 72 heures à l'avance.` : `Compte tenu de notre maillage de transporteurs dans le ${deptName}, comptez un délai moyen de livraison de 48 heures pour la commune de ${commune.nom}. Nous calons l'heure de passage en fonction de vos disponibilités.` },
        { question: `Quels sont les déchets strictement interdits dans vos bennes à ${commune.nom} ?`, answer: `Il est strictement interdit de déposer des déchets dangereux : amiante, pots de peinture pleins, solvants, batteries, pneus et bouteilles de gaz. Pour ces déchets spécifiques, vous devez vous orienter vers des filières de collecte spécialisées du ${deptCode}.` },
        { question: `Quelle taille de benne dois-je choisir pour vider ma maison à ${commune.nom} ?`, answer: `Pour un débarras classique (meubles, cartons, tapis), nous conseillons généralement une benne de 10m³ à 15m³. Pour vider entièrement une maison à ${commune.nom}, une benne de 20m³ voire 30m³ est plus adaptée pour éviter une double rotation.` }
      ],
      [
        { question: `Comment se passe le paiement de la location de benne à ${commune.nom} ?`, answer: `Le règlement s'effectue généralement par carte bancaire ou virement lors de la réservation de la benne. Pour les professionnels du bâtiment et gros clients réguliers sur le secteur de ${commune.nom}, des conditions de facturation personnalisées peuvent être mises en place.` },
        { question: `Est-il obligatoire de trier ses déchets à ${commune.nom} ?`, answer: `Oui, pour les professionnels (décret 7 flux) et fortement conseillé pour les particuliers. À ${commune.nom}, louer une benne mono-flux (uniquement du bois ou uniquement des gravats) réduit significativement le coût final de traitement par rapport à une benne tout-venant.` },
        { question: `Le camion peut-il passer sous les lignes électriques ou les porches à ${commune.nom} ?`, answer: `Nos camions nécessitent une hauteur de passage minimale de 4,50 mètres et une largeur de 3 mètres. Si le chemin d'accès à votre chantier à ${commune.nom} présente un obstacle (porche étroit, lignes basses), veuillez le signaler à notre conseiller lors du devis.` }
      ],
      [
        { question: `Peut-on commander une benne pour le week-end à ${commune.nom} ?`, answer: `Nos livraisons à ${commune.nom} s'effectuent du lundi au vendredi. Cependant, la benne peut rester sur votre chantier pendant le week-end sans supplément si elle a été livrée le vendredi. Le retrait sera programmé en début de semaine suivante.` },
        { question: `Combien de temps puis-je garder la benne à ${commune.nom} ?`, answer: `Le forfait standard inclut 5 jours de mise à disposition à ${commune.nom}. Au-delà, un supplément journalier modéré est facturé. Pour les chantiers de longue durée, demandez un devis personnalisé avec un tarif adapté.` },
        { question: `Fournissez-vous un bordereau de suivi des déchets à ${commune.nom} ?`, answer: `Oui, pour tous les professionnels à ${commune.nom}, nous fournissons systématiquement un bordereau de suivi des déchets (BSDD) attestant de la nature, du poids et de la destination de traitement de vos déchets. Ce document est indispensable pour vos audits réglementaires.` }
      ],
      [
        { question: `Quelle est la différence entre une benne gravats et une benne DIB à ${commune.nom} ?`, answer: `La benne gravats (8m³, renforcée) est réservée aux matériaux inertes très lourds : béton, terre, tuiles, pierres. La benne DIB (10-30m³) accueille les déchets mélangés plus légers : bois, plâtre, plastiques, métaux. À ${commune.nom}, mélanger les inertes avec le DIB entraîne une surfacturation importante en décharge.` },
        { question: `Puis-je charger la benne moi-même à ${commune.nom} ?`, answer: `Absolument, c'est le principe de notre service à ${commune.nom}. Nous posons la benne, vous la chargez à votre rythme pendant la durée de location, puis nous venons l'enlever. Le chargement ne doit pas dépasser le bord supérieur du caisson pour la sécurité du transport.` },
        { question: `Que deviennent mes déchets après le retrait de la benne à ${commune.nom} ?`, answer: `Vos déchets collectés à ${commune.nom} sont acheminés vers un centre de tri agréé du ${deptName}. Les inertes sont concassés en granulats routiers, le bois est valorisé en énergie, les métaux sont refondus et le plastique est recyclé. Nous maximisons le taux de valorisation pour réduire l'enfouissement.` }
      ],
      [
        { question: `Est-ce que la benne peut endommager mon allée à ${commune.nom} ?`, answer: `Nos chauffeurs à ${commune.nom} placent systématiquement des cales en bois sous les points d'appui de la benne pour répartir le poids et protéger votre sol. Sur les surfaces fragiles (dalles, enrobé neuf), nous ajoutons des planches de protection supplémentaires sur demande.` },
        { question: `Y a-t-il un poids maximum à ne pas dépasser à ${commune.nom} ?`, answer: `Oui, chaque benne a une charge utile maximale. Pour une benne gravats 8m³ à ${commune.nom}, la limite est de 10 tonnes (le béton est très lourd). Pour une benne DIB 15m³, comptez 6 à 8 tonnes maximum. Ne jamais dépasser le bord supérieur du caisson.` },
        { question: `Proposez-vous des bennes avec porte arrière à ${commune.nom} ?`, answer: `Oui, nos bennes de 20m³ et 30m³ livrées à ${commune.nom} sont équipées de portes arrière à deux battants. Cela facilite le chargement au sol avec un diable ou une brouette, sans avoir à soulever les objets lourds par-dessus le bord du caisson.` }
      ],
      [
        { question: `Peut-on mélanger gravats et bois dans la même benne à ${commune.nom} ?`, answer: `Non, c'est fortement déconseillé à ${commune.nom}. Les gravats inertes (béton, tuiles) sont traités dans des filières de concassage à bas coût, tandis que le bois est valorisé en énergie. En les mélangeant, vous perdez ces avantages et payez le tarif DIB mélangé, nettement plus cher.` },
        { question: `Faites-vous la collecte de la benne le jour même à ${commune.nom} ?`, answer: `L'enlèvement à ${commune.nom} est généralement programmé dans les 24 à 48 heures suivant votre appel. En cas d'urgence absolue (ex : fin de chantier, contrainte de voirie), nous pouvons organiser un retrait le jour même sous réserve de disponibilité de nos camions.` },
        { question: `Dois-je être présent lors de la livraison de la benne à ${commune.nom} ?`, answer: `Ce n'est pas obligatoire si vous nous avez précisément indiqué l'emplacement souhaité à ${commune.nom}. Nos chauffeurs sont autonomes et déposent la benne à l'endroit convenu. Toutefois, votre présence est préférable si l'accès est complexe ou si le sol nécessite des précautions particulières.` }
      ]
    ],
    gravats: [
      [
        { question: `Quel type de béton peut-on mettre dans une benne gravats à ${commune.nom} ?`, answer: `Tous les types de béton sont acceptés dans nos bennes gravats à ${commune.nom} : béton brut, béton armé (avec ferraille), béton cellulaire et béton préfabriqué. Le béton armé contenant des armatures en acier est séparé magnétiquement au centre de recyclage.` },
        { question: `Peut-on mettre de la terre dans une benne gravats à ${commune.nom} ?`, answer: `Oui, la terre brute non polluée est acceptée dans nos bennes gravats à ${commune.nom}. Cependant, la terre mélangée à des racines, de l'herbe ou des cailloux sera reclassée en déchet non inerte et le tarif de traitement sera ajusté en conséquence.` },
        { question: `Pourquoi la benne gravats est-elle limitée à 8m³ à ${commune.nom} ?`, answer: `Les matériaux inertes (béton, terre, pierres) sont extrêmement lourds : 1m³ de béton pèse environ 2,3 tonnes. Au-delà de 8m³, la benne dépasserait le poids total roulant autorisé (PTRA) pour nos camions sur la voirie de ${commune.nom} et de tout le ${deptCode}.` }
      ],
      [
        { question: `Combien coûte une benne à gravats à ${commune.nom} en 2026 ?`, answer: `Le tarif moyen d'une benne à gravats 8m³ à ${commune.nom} est d'environ ${prices.gravats}€ HT tout compris. Ce prix inclut le transport, 5 jours de location, l'enlèvement et le recyclage en centre de concassage agréé du ${deptName}.` },
        { question: `Le carrelage et la faïence sont-ils acceptés comme gravats à ${commune.nom} ?`, answer: `Oui, le carrelage, la faïence, la céramique et les sanitaires en porcelaine sont des matériaux inertes parfaitement acceptés dans nos bennes gravats à ${commune.nom}. Ils sont broyés et intégrés aux granulats de recyclage.` },
        { question: `Que faire si j'ai un petit volume de gravats à ${commune.nom} ?`, answer: `Pour les volumes inférieurs à 3-4m³ de gravats à ${commune.nom}, la location d'une benne 8m³ reste la solution la plus pratique et économique. Vous ne payez pas au poids mais au forfait, donc même une benne à moitié pleine est intéressante.` }
      ],
      [
        { question: `Les tuiles peuvent-elles aller avec le béton à ${commune.nom} ?`, answer: `Oui, tuiles, briques, ardoises et béton sont tous des matériaux inertes compatibles dans la même benne gravats à ${commune.nom}. Cette compatibilité permet de mélanger tous les déchets de démolition de toiture et de murs sans surcoût de tri.` },
        { question: `Peut-on mettre du plâtre dans une benne gravats à ${commune.nom} ?`, answer: `Non, le plâtre (plaques BA13, enduits) est strictement interdit dans les bennes gravats à ${commune.nom}. Le plâtre est un matériau non inerte qui doit être orienté vers une filière de traitement spécifique. Sa présence dans une benne gravats reclasse tout le chargement en DIB.` },
        { question: `Comment sont recyclés les gravats collectés à ${commune.nom} ?`, answer: `Les gravats inertes de ${commune.nom} sont acheminés vers des plateformes de concassage du ${deptName}. Le béton est broyé en granulats pour les sous-couches routières, les tuiles sont concassées pour le drainage, et les métaux (ferraille du béton armé) sont extraits magnétiquement pour être refondus.` }
      ],
      [
        { question: `Peut-on mettre des pierres naturelles dans une benne gravats à ${commune.nom} ?`, answer: `Oui, les pierres de taille, les moellons, les galets et les cailloux sont des matériaux inertes parfaitement acceptés dans nos bennes gravats à ${commune.nom}. Ils seront concassés et réutilisés en sous-couche de voirie ou en remblai de fondation.` },
        { question: `La benne gravats supporte-t-elle les dalles de terrasse à ${commune.nom} ?`, answer: `Absolument. Les dalles de terrasse en béton, en pierre reconstituée ou en céramique sont des inertes acceptés à ${commune.nom}. Attention toutefois aux dalles sur plots : les plots en plastique doivent être retirés car le plastique est interdit dans les bennes gravats.` },
        { question: `Faut-il casser le béton avant de le mettre dans la benne à ${commune.nom} ?`, answer: `Il n'est pas obligatoire de concasser le béton avant de le charger dans la benne à ${commune.nom}. Cependant, les morceaux de plus de 50 cm de côté sont plus difficiles à manipuler et à recycler. Nous recommandons de les réduire à la masse ou au burineur si possible.` }
      ],
      [
        { question: `Que faire des ardoises de toiture à ${commune.nom} ?`, answer: `Les ardoises naturelles et les ardoises en fibrociment SANS amiante sont acceptées dans nos bennes gravats à ${commune.nom}. ATTENTION : les ardoises en fibrociment posées avant 1997 peuvent contenir de l'amiante et nécessitent un diagnostic préalable avant évacuation.` },
        { question: `La benne gravats peut-elle stationner sur un terrain en pente à ${commune.nom} ?`, answer: `Nos chauffeurs à ${commune.nom} peuvent poser une benne gravats sur un terrain en légère pente grâce au système de calage hydraulique du camion. Cependant, au-delà de 8% de pente, le risque de glissement de la benne chargée nous impose de trouver un emplacement alternatif plus plat.` },
        { question: `Acceptez-vous les bordures en béton dans vos bennes à ${commune.nom} ?`, answer: `Oui, les bordures de jardin, les bordures de trottoir et les caniveaux en béton sont des inertes acceptés dans nos bennes gravats à ${commune.nom}. Leur poids important (environ 30 kg par mètre linéaire) doit être pris en compte dans le calcul du tonnage total de la benne.` }
      ],
      [
        { question: `Où partent les gravats collectés à ${commune.nom} ?`, answer: `Les gravats de ${commune.nom} sont orientés vers les carrières et plateformes de recyclage partenaires du ${deptName}. Le béton concassé devient du GNT (Grave Non Traitée) pour les routes, les tuiles sont transformées en matériau drainant, et l'acier extrait du béton armé est refondu en aciérie.` },
        { question: `Puis-je remplir la benne à ras bord avec des gravats à ${commune.nom} ?`, answer: `Vous devez remplir la benne gravats à ${commune.nom} de manière à ce que rien ne dépasse du bord supérieur du caisson. Les matériaux inertes étant très lourds, la limite de poids (10 tonnes) est souvent atteinte avant que la benne ne soit pleine en volume.` },
        { question: `Est-ce moins cher de trier les gravats séparément à ${commune.nom} ?`, answer: `Oui, significativement. À ${commune.nom}, une benne de gravats propres (béton, tuiles uniquement) coûte environ 30% moins cher à traiter qu'une benne de DIB mélangé. Le tri à la source est le meilleur levier pour réduire votre facture de gestion des déchets.` }
      ],
      [
        { question: `Quelles sont les différences de tarif entre gravats propres et gravats mélangés à ${commune.nom} ?`, answer: `À ${commune.nom}, les gravats propres (100% inertes : béton, tuiles, terre) bénéficient d'un tarif de traitement d'environ ${prices.gravats}€ HT. Si des déchets non inertes sont détectés (bois, plastique, plâtre), la benne est reclassée en DIB et le tarif passe à environ ${prices.dib}€ HT.` },
        { question: `La terre argileuse est-elle acceptée dans les bennes gravats à ${commune.nom} ?`, answer: `La terre argileuse non polluée est acceptée dans nos bennes gravats à ${commune.nom}. En revanche, la terre contenant des déchets de démolition (morceaux de plastique, bois, racines) sera considérée comme un mélange DIB et facturée au tarif correspondant.` },
        { question: `Peut-on mettre des parpaings dans la benne gravats à ${commune.nom} ?`, answer: `Oui, les parpaings (blocs de béton creux) sont des matériaux inertes parfaitement adaptés à nos bennes gravats à ${commune.nom}. Ils sont concassés et recyclés en sous-couche routière, tout comme le béton plein et les briques.` }
      ]
    ],
    encombrants: [
      [
        { question: `Combien coûte une benne pour vider une maison à ${commune.nom} ?`, answer: `Pour un vide-maison complet à ${commune.nom}, comptez une benne tout-venant de 15m³ à 20m³ au tarif d'environ ${prices.dib}€ à 590€ HT selon le volume. Ce prix inclut la livraison, 5 jours de location, l'enlèvement et le tri en centre agréé du ${deptName}.` },
        { question: `Peut-on mettre un frigo ou un lave-linge dans la benne à ${commune.nom} ?`, answer: `Oui, les appareils électroménagers (réfrigérateurs, machines à laver, fours) sont acceptés dans nos bennes encombrants à ${commune.nom}. Ils seront séparés au centre de tri pour être dépollués et recyclés conformément à la directive DEEE.` },
        { question: `La benne encombrants accepte-t-elle les matelas à ${commune.nom} ?`, answer: `Oui, les matelas, sommiers et canapés sont acceptés dans nos bennes encombrants à ${commune.nom}. Les matelas sont envoyés vers des filières de recyclage spécialisées qui séparent la mousse, le tissu et les ressorts pour les valoriser séparément.` }
      ],
      [
        { question: `Quelle taille de benne pour vider un garage à ${commune.nom} ?`, answer: `Pour vider un garage standard à ${commune.nom}, une benne de 10m³ est généralement suffisante. Si le garage contient beaucoup de mobilier volumineux (étagères, vélos, outils) en plus des cartons, optez pour une benne de 15m³ pour avoir une marge confortable.` },
        { question: `Les cartons et papiers vont-ils dans la benne encombrants à ${commune.nom} ?`, answer: `Oui, les cartons d'emballage, les livres, les journaux et les archives papier sont acceptés dans nos bennes encombrants à ${commune.nom}. Ils seront séparés au centre de tri et orientés vers la filière de recyclage papier-carton.` },
        { question: `Peut-on jeter des vêtements dans la benne à ${commune.nom} ?`, answer: `Les textiles en grande quantité à ${commune.nom} sont acceptés dans nos bennes encombrants. Cependant, si les vêtements sont en bon état, nous vous encourageons à les donner aux associations caritatives locales avant de recourir à la benne.` }
      ],
      [
        { question: `Acceptez-vous les déchets de cuisine dans la benne encombrants à ${commune.nom} ?`, answer: `Les meubles de cuisine (caissons, plans de travail, éléments hauts) sont acceptés dans nos bennes encombrants à ${commune.nom}. En revanche, les déchets alimentaires et les ordures ménagères sont strictement interdits : ils doivent être évacués via la collecte municipale.` },
        { question: `Peut-on mettre des jouets et du mobilier de jardin en plastique dans la benne à ${commune.nom} ?`, answer: `Oui, les jouets en plastique, le mobilier de jardin (tables, chaises, transats) et les accessoires de loisirs volumineux sont tous acceptés dans nos bennes encombrants à ${commune.nom}. Les plastiques seront triés et orientés vers les filières de recyclage adaptées.` },
        { question: `Comment organiser un vide-maison efficace avec une benne à ${commune.nom} ?`, answer: `À ${commune.nom}, nous conseillons de commencer par trier les objets réutilisables (don à des associations) avant de charger la benne. Chargez les objets lourds au fond (meubles) et comblez les espaces avec les petits objets. Une benne bien remplie évite les doubles rotations.` }
      ],
      [
        { question: `Peut-on y mettre un canapé et un sommier à ${commune.nom} ?`, answer: `Absolument. Les canapés, les fauteuils, les sommiers à lattes et les sommiers à ressorts sont parmi les objets les plus fréquemment déposés dans nos bennes encombrants à ${commune.nom}. Nos centres de tri les démantèlent pour récupérer le bois, le métal et la mousse.` },
        { question: `Faut-il démonter les meubles avant de les mettre dans la benne à ${commune.nom} ?`, answer: `Ce n'est pas obligatoire à ${commune.nom}, mais fortement recommandé. Des meubles démontés occupent 40 à 50% de volume en moins dans la benne, ce qui vous permet potentiellement de choisir un format plus petit et donc moins cher.` },
        { question: `Les équipements informatiques sont-ils acceptés dans la benne à ${commune.nom} ?`, answer: `Les écrans, ordinateurs, imprimantes et claviers peuvent être déposés dans nos bennes encombrants à ${commune.nom}. Ils seront isolés au centre de tri pour être traités selon la filière DEEE (Déchets d'Équipements Électriques et Électroniques) et dépollués correctement.` }
      ],
      [
        { question: `Peut-on louer une benne encombrants pour une copropriété à ${commune.nom} ?`, answer: `Oui, les syndics et conseils syndicaux de ${commune.nom} nous contactent régulièrement pour organiser des opérations de débarras collectif. La benne de 20m³ est idéale pour être placée dans la cour de la résidence pendant 3 à 5 jours.` },
        { question: `Les sanitaires (WC, lavabo, baignoire) vont dans quelle benne à ${commune.nom} ?`, answer: `Les sanitaires en céramique ou en porcelaine (WC, lavabos, bidet) sont des inertes et peuvent aller dans une benne gravats à ${commune.nom}. Les baignoires en acrylique ou en résine, étant en plastique, doivent aller dans une benne encombrants/DIB.` },
        { question: `Peut-on mettre des miroirs et du verre dans la benne encombrants à ${commune.nom} ?`, answer: `Les miroirs, les vitres et le verre plat sont acceptés dans nos bennes encombrants à ${commune.nom}. Par sécurité, enveloppez les grands morceaux de verre dans du carton pour éviter les coupures lors du chargement et du transport.` }
      ],
      [
        { question: `Quels objets sont interdits dans la benne encombrants à ${commune.nom} ?`, answer: `Sont strictement interdits dans nos bennes encombrants à ${commune.nom} : les déchets dangereux (peintures, solvants, huiles), les pneus, les bouteilles de gaz, les batteries automobiles, les médicaments et l'amiante. Ces déchets nécessitent des filières de collecte spécialisées.` },
        { question: `La benne encombrants a-t-elle une porte pour faciliter le chargement à ${commune.nom} ?`, answer: `Nos bennes de 20m³ et 30m³ livrées à ${commune.nom} sont équipées de portes arrière battantes. Cette configuration permet de charger les objets lourds (meubles, électroménager) par l'arrière au niveau du sol, sans avoir à les soulever par-dessus le bord.` },
        { question: `Peut-on prolonger la location de la benne encombrants à ${commune.nom} ?`, answer: `Oui, la durée de location à ${commune.nom} est flexible. Le forfait inclut 5 jours, mais vous pouvez prolonger de quelques jours supplémentaires moyennant un tarif journalier additionnel. Prévenez-nous simplement 24 heures avant la date de retrait prévue.` }
      ],
      [
        { question: `Quelle est la meilleure période pour louer une benne encombrants à ${commune.nom} ?`, answer: `À ${commune.nom}, les périodes de forte demande sont le printemps (grand nettoyage) et l'automne (avant l'hiver). Pour garantir votre créneau, réservez 3 à 5 jours à l'avance. En été et en hiver, les délais sont plus courts car la demande est moindre.` },
        { question: `Peut-on mettre un piano ou un coffre-fort dans la benne à ${commune.nom} ?`, answer: `Les pianos droits et les coffres-forts sont acceptés dans nos bennes encombrants à ${commune.nom}. Attention cependant à leur poids exceptionnel : un piano pèse 200 à 300 kg et un coffre-fort peut dépasser 500 kg. Prévoyez une aide pour les charger et tenez compte de ces poids dans le calcul de la charge totale.` },
        { question: `Fournissez-vous un certificat de destruction pour les archives à ${commune.nom} ?`, answer: `Pour les entreprises de ${commune.nom} qui évacuent des archives confidentielles, nous pouvons organiser un passage par une filière de destruction certifiée avec émission d'un certificat de destruction confidentielle. Mentionnez ce besoin lors de votre demande de devis.` }
      ]
    ],
    'dechets-verts': [
      [
        { question: `Le brûlage des déchets verts est-il autorisé à ${commune.nom} ?`, answer: `Non, le brûlage des déchets verts à l'air libre est interdit par arrêté préfectoral dans l'ensemble du département du ${deptCode}, y compris à ${commune.nom}. Cette infraction est passible d'une amende de 450 €. La location de benne est l'alternative légale et écologique pour évacuer vos végétaux.` },
        { question: `Combien coûte une benne déchets verts à ${commune.nom} ?`, answer: `Le tarif d'une benne déchets verts de 10-15m³ à ${commune.nom} est d'environ ${prices.verts}€ HT tout compris. Ce prix inclut le transport, la location, l'enlèvement et le compostage industriel de vos végétaux dans le département du ${deptName}.` },
        { question: `Les souches d'arbres sont-elles acceptées dans la benne verte à ${commune.nom} ?`, answer: `Oui, les souches d'arbres (même volumineuses), les troncs débités et les grosses branches sont acceptés dans nos bennes déchets verts à ${commune.nom}. Pour les souches de très grand diamètre, vérifiez qu'elles ne contiennent pas de terre ou de pierres qui alourdiraient inutilement le chargement.` }
      ],
      [
        { question: `Peut-on mettre de la terre avec des racines dans la benne verte à ${commune.nom} ?`, answer: `Une quantité modérée de terre attachée aux racines est tolérée dans nos bennes déchets verts à ${commune.nom}. Cependant, si votre chargement contient principalement de la terre, il sera reclassé en gravats/inertes et le tarif sera ajusté en conséquence.` },
        { question: `Les sacs plastiques de déchets verts doivent-ils être vidés à ${commune.nom} ?`, answer: `Oui, les sacs plastiques (même biodégradables) doivent être vidés avant de déposer les végétaux dans la benne à ${commune.nom}. Les sacs en plastique perturbent le processus de compostage industriel et contaminent le compost final. Videz le contenu directement dans la benne.` },
        { question: `Quelle benne pour un gros chantier d'élagage à ${commune.nom} ?`, answer: `Pour un chantier d'élagage professionnel à ${commune.nom} (taille de plusieurs grands arbres), nous recommandons une benne de 15m³ voire 30m³. Les branches non compactées occupent beaucoup de volume. Prévoir un broyeur réduit le volume de 3 à 5 fois et permet de choisir une benne plus petite.` }
      ],
      [
        { question: `Les bambous et les lauriers sont-ils acceptés à ${commune.nom} ?`, answer: `Oui, les bambous, les lauriers, les thuyas et toutes les tailles de haie sont acceptés dans nos bennes déchets verts à ${commune.nom}. Ces végétaux ligneux seront broyés et intégrés au processus de compostage industriel.` },
        { question: `Peut-on mélanger gazon tondu et branches dans la même benne à ${commune.nom} ?`, answer: `Absolument. À ${commune.nom}, notre benne déchets verts accepte le mélange de tous types de végétaux : tontes de pelouse, branches, feuilles mortes, tailles de haie et souches. C'est d'ailleurs ce mélange qui favorise un compostage de qualité.` },
        { question: `Où sont compostés les déchets verts de ${commune.nom} ?`, answer: `Les végétaux collectés à ${commune.nom} sont acheminés vers la plateforme de compostage la plus proche dans le ${deptCode}. Ils sont transformés en compost normalisé (NF U 44-051) redistribué aux agriculteurs, maraîchers et espaces verts municipaux de la région.` }
      ],
      [
        { question: `Les haies de cyprès arrachées peuvent-elles aller dans la benne verte à ${commune.nom} ?`, answer: `Oui, les cyprès arrachés, taillés ou coupés sont des déchets verts acceptés dans nos bennes à ${commune.nom}. Veillez à secouer les mottes de terre des racines pour réduire le poids et faciliter le compostage.` },
        { question: `Les palmes et les plantes exotiques sont-elles acceptées à ${commune.nom} ?`, answer: `Les plantes exotiques, palmes, yuccas et bambous sont acceptés dans nos bennes déchets verts à ${commune.nom}. En revanche, les espèces invasives réglementées (comme l'ambroisie ou la renouée du Japon) doivent être signalées pour un traitement spécifique.` },
        { question: `Peut-on utiliser la benne verte en hiver à ${commune.nom} ?`, answer: `La demande en bennes déchets verts à ${commune.nom} est naturellement plus faible en hiver, mais le service reste disponible toute l'année. C'est même la période idéale pour les gros travaux d'abattage et d'élagage, avec des délais de livraison plus courts.` }
      ],
      [
        { question: `Le bois de haie taillée va dans la benne verte ou dans la benne bois à ${commune.nom} ?`, answer: `Les tailles de haie (branches vertes avec feuilles) vont dans la benne déchets verts à ${commune.nom}. Le bois sec, les poteaux de clôture et les branches mortes de gros diamètre peuvent aller dans la benne bois/DIB si vous souhaitez bénéficier du tarif de traitement le plus avantageux.` },
        { question: `Quelle période de l'année est la plus chargée pour les bennes vertes à ${commune.nom} ?`, answer: `À ${commune.nom}, les pics de demande pour les bennes déchets verts sont au printemps (mars-mai) et en automne (septembre-novembre). Réservez votre benne au moins 5 jours à l'avance pendant ces périodes pour garantir votre créneau de livraison.` },
        { question: `Peut-on mettre du terreau ou du compost usagé dans la benne verte à ${commune.nom} ?`, answer: `Le terreau et le compost usagé en petite quantité sont tolérés dans nos bennes déchets verts à ${commune.nom}. Si le volume de terreau est important, il sera considéré comme de la terre et devra être évacué dans une benne gravats/inertes.` }
      ],
      [
        { question: `La tonte de pelouse seule peut-elle remplir une benne à ${commune.nom} ?`, answer: `Oui, la tonte de pelouse fraîche est un déchet vert accepté dans nos bennes à ${commune.nom}. Attention : l'herbe fraîchement coupée est très lourde (riche en eau) et peut rapidement atteindre la limite de poids de la benne. Laissez-la sécher quelques jours si possible.` },
        { question: `Les plantes en pot (avec la terre) vont-elles dans la benne verte à ${commune.nom} ?`, answer: `Les plantes doivent être retirées de leurs pots avant d'être mises dans la benne verte à ${commune.nom}. Les pots en plastique sont interdits dans les bennes déchets verts. La terre végétale peut rester sur les racines en quantité raisonnable.` },
        { question: `Faut-il couper les branches avant de les mettre dans la benne à ${commune.nom} ?`, answer: `Il n'est pas obligatoire de couper les branches à ${commune.nom}, mais c'est recommandé. Des branches de moins de 2 mètres s'emboîtent mieux dans la benne et permettent de charger davantage de volume. Les tronçons de gros diamètre doivent être débités pour faciliter le compostage.` }
      ],
      [
        { question: `Les feuilles mortes en grande quantité sont-elles acceptées à ${commune.nom} ?`, answer: `Oui, les feuilles mortes en vrac ou en sacs (vidés dans la benne, sans les sacs plastique) sont acceptées dans nos bennes déchets verts à ${commune.nom}. Elles constituent un excellent apport pour le compostage industriel.` },
        { question: `Peut-on déposer des algues ou des plantes aquatiques dans la benne verte à ${commune.nom} ?`, answer: `Les plantes aquatiques d'étangs de jardin et les algues d'eau douce sont acceptées dans nos bennes déchets verts à ${commune.nom}. Égouttez-les au maximum avant de les déposer dans la benne pour limiter le poids d'eau.` },
        { question: `Les résidus de taille de vigne sont-ils acceptés à ${commune.nom} ?`, answer: `Oui, les sarments de vigne, les résidus de taille de treille et les ceps arrachés sont des déchets verts acceptés dans nos bennes à ${commune.nom}. Ils seront broyés et compostés avec les autres végétaux collectés.` }
      ]
    ],
    dib: [
      [
        { question: `Quelle est la différence entre une benne DIB et une benne bois à ${commune.nom} ?`, answer: `À ${commune.nom}, la benne bois (mono-flux) accepte uniquement le bois brut : palettes, planches, charpentes non traitées. La benne DIB (tout-venant) accepte les mélanges : bois + plâtre + plastique + métaux. Le tarif de la benne bois pure est inférieur car le bois se valorise mieux en filière bois-énergie.` },
        { question: `Le plâtre (BA13) peut-il aller dans une benne DIB à ${commune.nom} ?`, answer: `Oui, les plaques de plâtre (BA13, BA10) et les enduits plâtrés sont acceptés dans nos bennes DIB à ${commune.nom}. Le plâtre est recyclé dans des usines spécialisées qui le transforment en matière première pour de nouvelles plaques. C'est un matériau interdit dans les bennes gravats.` },
        { question: `Combien coûte une benne DIB à ${commune.nom} ?`, answer: `Le tarif d'une benne DIB 10m³ à ${commune.nom} commence à environ ${prices.dib}€ HT tout compris. Pour les volumes plus importants (15m³, 20m³, 30m³), le prix au m³ diminue. Le tarif exact dépend de la nature des déchets : un tri à la source réduit significativement la facture.` }
      ],
      [
        { question: `Les métaux (radiateurs, gouttières) vont dans quelle benne à ${commune.nom} ?`, answer: `Les métaux légers (gouttières en zinc, radiateurs en fonte, tuyaux en cuivre) peuvent aller dans nos bennes DIB à ${commune.nom}. Cependant, si vous avez un volume important de métaux purs, une collecte dédiée par un ferrailleur sera plus avantageuse financièrement.` },
        { question: `La laine de verre et les isolants vont dans quelle benne à ${commune.nom} ?`, answer: `La laine de verre, la laine de roche, le polystyrène et les panneaux d'isolation sont des DIB acceptés dans nos bennes tout-venant à ${commune.nom}. Attention : les isolants à base d'amiante (flocage, calorifugeage) sont strictement interdits et nécessitent un désamianteur agréé.` },
        { question: `Peut-on mélanger le bois et le plastique dans la même benne DIB à ${commune.nom} ?`, answer: `Oui, c'est le principe même de la benne DIB (Déchets Industriels Banals) à ${commune.nom} : elle accepte les mélanges de matériaux non dangereux. Les bois, plastiques, métaux, plâtre et cartons sont ensuite séparés mécaniquement au centre de tri.` }
      ],
      [
        { question: `Les fenêtres en PVC avec le verre sont-elles acceptées en DIB à ${commune.nom} ?`, answer: `Oui, les menuiseries en PVC ou en aluminium avec leurs vitrages sont acceptées dans nos bennes DIB à ${commune.nom}. Au centre de tri, le verre est séparé des cadres qui sont ensuite broyés et recyclés par matériau.` },
        { question: `Le décret 7 flux s'applique-t-il aux particuliers à ${commune.nom} ?`, answer: `Le décret 7 flux est une obligation réglementaire qui s'applique uniquement aux entreprises produisant plus de 1 100 litres de déchets par semaine. Les particuliers de ${commune.nom} ne sont pas soumis à cette obligation mais sont encouragés à trier leurs déchets pour bénéficier de tarifs de traitement plus bas.` },
        { question: `Les moquettes et revêtements de sol vont dans la benne DIB à ${commune.nom} ?`, answer: `Oui, les moquettes, les revêtements de sol en PVC (linoléum), les parquets flottants et les dalles de moquette sont des DIB acceptés dans nos bennes tout-venant à ${commune.nom}. Ces matériaux sont orientés vers des filières de valorisation énergétique.` }
      ],
      [
        { question: `Les palettes en bois traitées sont-elles acceptées à ${commune.nom} ?`, answer: `Les palettes traitées thermiquement (marquage HT) sont acceptées dans nos bennes bois/DIB à ${commune.nom}. Les palettes traitées chimiquement au bromure de méthyle (marquage MB) sont interdites car considérées comme déchets dangereux. Vérifiez le marquage avant de les charger.` },
        { question: `Peut-on mettre des câbles électriques dans la benne DIB à ${commune.nom} ?`, answer: `Oui, les câbles électriques (cuivre ou aluminium gainés) sont acceptés dans nos bennes DIB à ${commune.nom}. Au centre de tri, les câbles sont broyés et les métaux conducteurs sont séparés de la gaine plastique pour être recyclés séparément.` },
        { question: `Les portes intérieures et les plinthes vont dans quelle benne à ${commune.nom} ?`, answer: `Les portes intérieures (bois, MDF, isoplane) et les plinthes sont des déchets de bois/DIB acceptés dans nos bennes à ${commune.nom}. Si elles sont en bois massif non traité, une benne bois mono-flux sera plus économique.` }
      ],
      [
        { question: `Les emballages de matériaux de construction vont dans la benne DIB à ${commune.nom} ?`, answer: `Oui, les films plastiques, les palettes de livraison, les cartons d'emballage et les sangles de cerclage issus de vos matériaux de construction sont des DIB acceptés dans nos bennes à ${commune.nom}. Le tri de ces emballages au centre de recyclage permet une valorisation matière élevée.` },
        { question: `Le placo hydrofuge (vert) et le placo coupe-feu (rose) sont-ils acceptés à ${commune.nom} ?`, answer: `Oui, toutes les plaques de plâtre sont acceptées dans nos bennes DIB à ${commune.nom} : standard (BA13 blanc), hydrofuge (vert), coupe-feu (rose) et phonique (bleu). Elles sont toutes recyclables dans les mêmes usines de traitement du plâtre.` },
        { question: `Peut-on mettre des tuyaux de plomberie en cuivre dans la benne DIB à ${commune.nom} ?`, answer: `Les tuyaux en cuivre sont acceptés dans nos bennes DIB à ${commune.nom}. Cependant, le cuivre ayant une valeur de revente significative, nous vous recommandons de le séparer et de le vendre directement à un ferrailleur pour en tirer un meilleur prix.` }
      ],
      [
        { question: `Les panneaux solaires usagés vont dans la benne DIB à ${commune.nom} ?`, answer: `Non, les panneaux photovoltaïques sont des DEEE (Déchets d'Équipements Électriques et Électroniques) et doivent être collectés par la filière PV Cycle à ${commune.nom}. Ils ne doivent pas être déposés dans une benne DIB standard.` },
        { question: `Le bois peint ou vernis est-il accepté dans la benne bois à ${commune.nom} ?`, answer: `Le bois peint ou verni est accepté dans nos bennes bois/DIB à ${commune.nom}, à condition que la peinture ne contienne pas de plomb (peintures d'avant 1949). Le bois peint moderne est valorisé en énergie thermique dans les chaufferies industrielles.` },
        { question: `Les cloisons amovibles de bureau vont dans quelle benne à ${commune.nom} ?`, answer: `Les cloisons amovibles (métal + vitrage ou métal + panneau de particules) sont des DIB acceptés dans nos bennes tout-venant à ${commune.nom}. Au centre de tri, les différents matériaux (verre, acier, bois) sont séparés mécaniquement pour être recyclés.` }
      ],
      [
        { question: `Faut-il un bordereau de suivi pour les DIB à ${commune.nom} ?`, answer: `Pour les professionnels à ${commune.nom}, le bordereau de suivi des déchets (BSDD) est obligatoire pour tout chargement de DIB. Nous le fournissons systématiquement avec chaque enlèvement. Ce document prouve que vos déchets ont été traités dans une installation agréée du ${deptName}.` },
        { question: `Les déchets de toiture (zinc, ardoise) vont dans quelle benne à ${commune.nom} ?`, answer: `Les matériaux de couverture à ${commune.nom} se répartissent ainsi : ardoises naturelles et tuiles → benne gravats ; zinc, aluminium et bac acier → benne DIB ; fibrociment ancien (pré-1997) → diagnostic amiante obligatoire avant toute manipulation.` },
        { question: `La benne DIB 30m³ est-elle adaptée pour un gros chantier à ${commune.nom} ?`, answer: `La benne 30m³ est notre plus grand format, idéal pour les gros chantiers de second œuvre à ${commune.nom}. Avec ses portes arrière battantes, elle facilite le chargement de longs éléments (poutres, panneaux, gaines). Sa capacité convient aux chantiers de démolition intérieure de bâtiments de 200m² et plus.` }
      ]
    ]
  };

  // 6. DYNAMIC ECO TEXT (7 variants, replaces the duplicated ADEME block)
  const ecoTexts = [
    `À ${commune.nom}, la réglementation environnementale impose le tri à la source pour les professionnels du bâtiment (décret 7 flux) et encourage vivement les particuliers à séparer leurs déchets. En choisissant nos bennes, vos matériaux sont acheminés vers les centres de tri agréés du ${deptName}, où ils sont valorisés, recyclés ou transformés en énergie, conformément à la loi AGEC et au Plan Régional de Prévention et Gestion des Déchets des Hauts-de-France.`,
    `La commune de ${commune.nom} est rattachée à un syndicat de traitement qui privilégie la valorisation matière et le recyclage. En louant notre benne, vous participez activement à l'économie circulaire locale du ${deptCode} : les inertes deviennent des granulats routiers, le bois est transformé en énergie thermique, et les métaux sont refondus dans les aciéries régionales.`,
    `Conformément aux objectifs de la loi AGEC applicable sur le territoire de ${commune.nom}, nous garantissons un taux de valorisation supérieur à 70% pour les déchets collectés dans nos bennes. Les matériaux recyclables (métaux, bois, cartons) sont séparés et réintégrés dans les filières industrielles du ${deptName}, tandis que le résidu non recyclable est valorisé énergétiquement.`,
    `Sur la commune de ${commune.nom}, les déchets de chantier collectés dans nos bennes suivent un circuit de traitement traçable et conforme à la réglementation environnementale. Chaque benne est pesée en entrée de centre de tri, et les bordereaux de suivi permettent de justifier le respect de vos obligations de producteur de déchets dans le ${deptCode}.`,
    `Le département du ${deptName} dispose d'un réseau dense de centres de traitement partenaires qui accueillent les déchets collectés à ${commune.nom}. Gravats concassés en sous-couche routière, bois broyé en combustible biomasse, plâtre recyclé en nouvelles plaques : chaque matériau trouve sa filière de valorisation locale.`,
    `En faisant appel à notre service de location de benne à ${commune.nom}, vous contribuez au respect des engagements environnementaux du ${deptCode}. La loi Anti-Gaspillage (AGEC) impose des objectifs ambitieux de recyclage des déchets du BTP : 70% de valorisation matière d'ici 2025. Nos pratiques de tri et de traitement sont alignées sur ces objectifs.`,
    `L'ADEME et les services de l'État encouragent le tri des déchets de chantier dès la source à ${commune.nom}. Notre offre de bennes mono-flux (gravats purs, bois pur, déchets verts purs) facilite ce tri et réduit significativement les coûts de traitement. Les déchets correctement triés à ${commune.nom} alimentent les filières de recyclage locales du ${deptName}, créant des emplois et préservant les ressources naturelles.`
  ];

  // Select the appropriate category FAQs
  const faqPool = categoryFaqs[category] || categoryFaqs.main;

  return {
    introParagraph: intros[category]?.[tier]?.[vIntro % (intros[category]?.[tier]?.length || 1)] || intros.main[tier][vIntro % intros.main[tier].length],
    logisticsAlert: logistics[tier][vLogistics],
    useCaseText: useCases[category][vUseCase],
    pricesContext: pricing[tier][vPricing],
    faqItems: faqPool[vFaq % faqPool.length],
    ecoText: ecoTexts[vEco],
    localContext: localContextVariants[getVariantIndex(commune.slug, 6)]
  };
}
