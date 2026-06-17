// 关系类型定义
export const relationTypes = [
  { id: 'family', name: '家人', color: '#E74C3C', icon: 'House' },
  { id: 'friend', name: '挚友', color: '#3498DB', icon: 'Connection' },
  { id: 'student', name: '学生', color: '#2ECC71', icon: 'Reading' },
  { id: 'colleague', name: '同僚', color: '#F39C12', icon: 'OfficeBuilding' },
  { id: 'political', name: '政敌', color: '#9B59B6', icon: 'Warning' },
  { id: 'mentor', name: '师长', color: '#1ABC9C', icon: 'Medal' }
]

// 人物数据
export const persons = [
  {
    id: 'sushi',
    name: '苏轼',
    courtesy: '子瞻',
    title: '东坡居士',
    birth: 1037,
    death: 1101,
    category: 'center',
    avatar: 'https://picsum.photos/seed/sushi/200/200',
    description: '北宋文学家、书画家、政治家。与父苏洵、弟苏辙合称"三苏"，为"唐宋八大家"之一。',
    achievements: ['唐宋八大家之一', '宋四家之一', '创立豪放词派'],
    poems: ['水调歌头·明月几时有', '念奴娇·赤壁怀古', '江城子·密州出猎']
  },
  {
    id: 'suxun',
    name: '苏洵',
    courtesy: '明允',
    title: '老泉',
    birth: 1009,
    death: 1066,
    category: 'family',
    avatar: 'https://picsum.photos/seed/suxun/200/200',
    description: '苏轼之父，北宋文学家，与苏轼、苏辙合称"三苏"。',
    achievements: ['唐宋八大家之一', '三苏之首']
  },
  {
    id: 'suzhe',
    name: '苏辙',
    courtesy: '子由',
    title: '颍滨遗老',
    birth: 1039,
    death: 1112,
    category: 'family',
    avatar: 'https://picsum.photos/seed/suzhe/200/200',
    description: '苏轼之弟，北宋文学家、政治家，与父兄合称"三苏"。',
    achievements: ['唐宋八大家之一', '官至门下侍郎']
  },
  {
    id: 'wangfu',
    name: '王弗',
    courtesy: '',
    title: '苏轼原配',
    birth: 1039,
    death: 1065,
    category: 'family',
    avatar: 'https://picsum.photos/seed/wangfu/200/200',
    description: '苏轼原配妻子，知书达理，与苏轼感情深厚。苏轼为其写下《江城子·乙卯正月二十日夜记梦》。'
  },
  {
    id: 'wangrunzhi',
    name: '王闰之',
    courtesy: '',
    title: '苏轼继室',
    birth: 1048,
    death: 1093,
    category: 'family',
    avatar: 'https://picsum.photos/seed/wangrunzhi/200/200',
    description: '苏轼继室，王弗堂妹，陪伴苏轼度过最艰难的岁月。'
  },
  {
    id: 'chaoyun',
    name: '王朝云',
    courtesy: '',
    title: '苏轼侍妾',
    birth: 1062,
    death: 1096,
    category: 'family',
    avatar: 'https://picsum.photos/seed/chaoyun/200/200',
    description: '苏轼侍妾，才貌双全，深得苏轼喜爱。苏轼称其"不合时宜，惟有朝云能识我"。'
  },
  {
    id: 'ouyangxiu',
    name: '欧阳修',
    courtesy: '永叔',
    title: '醉翁',
    birth: 1007,
    death: 1072,
    category: 'mentor',
    avatar: 'https://picsum.photos/seed/ouyangxiu/200/200',
    description: '北宋政治家、文学家，苏轼的恩师和伯乐。主持嘉祐二年科举，录取苏轼。',
    achievements: ['唐宋八大家之一', '北宋文坛领袖']
  },
  {
    id: 'huangtingjian',
    name: '黄庭坚',
    courtesy: '鲁直',
    title: '山谷道人',
    birth: 1045,
    death: 1105,
    category: 'student',
    avatar: 'https://picsum.photos/seed/huangtingjian/200/200',
    description: '北宋诗人、书法家，苏门四学士之首，与苏轼并称"苏黄"。',
    achievements: ['苏门四学士之首', '江西诗派开创者', '宋四家之一']
  },
  {
    id: 'qinguan',
    name: '秦观',
    courtesy: '少游',
    title: '淮海居士',
    birth: 1049,
    death: 1100,
    category: 'student',
    avatar: 'https://picsum.photos/seed/qinguan/200/200',
    description: '北宋词人，苏门四学士之一，婉约派代表人物。',
    achievements: ['苏门四学士之一', '婉约派代表']
  },
  {
    id: 'chaobuzhi',
    name: '晁补之',
    courtesy: '无咎',
    title: '归来子',
    birth: 1053,
    death: 1110,
    category: 'student',
    avatar: 'https://picsum.photos/seed/chaobuzhi/200/200',
    description: '北宋文学家，苏门四学士之一。',
    achievements: ['苏门四学士之一']
  },
  {
    id: 'zhanglei',
    name: '张耒',
    courtesy: '文潜',
    title: '柯山',
    birth: 1054,
    death: 1114,
    category: 'student',
    avatar: 'https://picsum.photos/seed/zhanglei/200/200',
    description: '北宋诗人，苏门四学士之一。',
    achievements: ['苏门四学士之一']
  },
  {
    id: 'wanganshi',
    name: '王安石',
    courtesy: '介甫',
    title: '半山',
    birth: 1021,
    death: 1086,
    category: 'political',
    avatar: 'https://picsum.photos/seed/wanganshi/200/200',
    description: '北宋政治家、文学家，主持熙宁变法。与苏轼政见不同，但文学上相互欣赏。',
    achievements: ['唐宋八大家之一', '熙宁变法主持者']
  },
  {
    id: 'simaguang',
    name: '司马光',
    courtesy: '君实',
    title: '涑水先生',
    birth: 1019,
    death: 1086,
    category: 'colleague',
    avatar: 'https://picsum.photos/seed/simaguang/200/200',
    description: '北宋政治家、史学家，《资治通鉴》主编。与苏轼同属保守派。',
    achievements: ['《资治通鉴》主编', '元祐更化主持者']
  },
  {
    id: 'fobizheng',
    name: '佛印',
    courtesy: '',
    title: '了元禅师',
    birth: 1032,
    death: 1098,
    category: 'friend',
    avatar: 'https://picsum.photos/seed/foyin/200/200',
    description: '北宋高僧，与苏轼交往甚密，留下许多趣闻轶事。'
  },
  {
    id: 'chenshiliang',
    name: '陈师道',
    courtesy: '履常',
    title: '后山居士',
    birth: 1053,
    death: 1102,
    category: 'student',
    avatar: 'https://picsum.photos/seed/chenshidao/200/200',
    description: '北宋诗人，苏门六君子之一，江西诗派重要人物。',
    achievements: ['苏门六君子之一']
  },
  {
    id: 'liqingzhao',
    name: '李清照',
    courtesy: '易安',
    title: '易安居士',
    birth: 1084,
    death: 1155,
    category: 'friend',
    avatar: 'https://picsum.photos/seed/liqingzhao/200/200',
    description: '宋代女词人，婉约派代表，虽与苏轼年代稍晚，但深受其影响。',
    achievements: ['千古第一才女', '婉约派代表']
  },
  {
    id: 'mifu',
    name: '米芾',
    courtesy: '元章',
    title: '米襄阳',
    birth: 1051,
    death: 1107,
    category: 'friend',
    avatar: 'https://picsum.photos/seed/mifu/200/200',
    description: '北宋书画家，与苏轼、黄庭坚、蔡襄并称"宋四家"。',
    achievements: ['宋四家之一', '书画鉴定大家']
  },
  {
    id: 'caixiang',
    name: '蔡襄',
    courtesy: '君谟',
    title: '蔡忠惠',
    birth: 1012,
    death: 1067,
    category: 'colleague',
    avatar: 'https://picsum.photos/seed/caixiang/200/200',
    description: '北宋书法家、政治家，宋四家之一。',
    achievements: ['宋四家之一', '茶学专家']
  },
  {
    id: 'zhangdun',
    name: '章惇',
    courtesy: '子厚',
    title: '',
    birth: 1035,
    death: 1105,
    category: 'political',
    avatar: 'https://picsum.photos/seed/zhangdun/200/200',
    description: '北宋政治家，新党领袖。早年与苏轼为友，后因政见不同成为政敌。'
  },
  {
    id: 'liuzongyuan',
    name: '曾巩',
    courtesy: '子固',
    title: '南丰先生',
    birth: 1019,
    death: 1083,
    category: 'colleague',
    avatar: 'https://picsum.photos/seed/zenggong/200/200',
    description: '北宋文学家，唐宋八大家之一，与苏轼同为欧阳修门生。',
    achievements: ['唐宋八大家之一']
  }
]

// 关系数据
export const relations = [
  // 家庭关系
  { source: 'sushi', target: 'suxun', type: 'family', label: '父子', description: '苏洵是苏轼的父亲' },
  { source: 'sushi', target: 'suzhe', type: 'family', label: '兄弟', description: '苏辙是苏轼的弟弟，兄弟情深' },
  { source: 'sushi', target: 'wangfu', type: 'family', label: '夫妻', description: '王弗是苏轼的原配妻子' },
  { source: 'sushi', target: 'wangrunzhi', type: 'family', label: '夫妻', description: '王闰之是苏轼的继室' },
  { source: 'sushi', target: 'chaoyun', type: 'family', label: '夫妾', description: '王朝云是苏轼的侍妾' },
  
  // 师生关系
  { source: 'sushi', target: 'ouyangxiu', type: 'mentor', label: '师生', description: '欧阳修是苏轼的恩师和伯乐' },
  { source: 'sushi', target: 'huangtingjian', type: 'student', label: '师生', description: '黄庭坚是苏门四学士之首' },
  { source: 'sushi', target: 'qinguan', type: 'student', label: '师生', description: '秦观是苏门四学士之一' },
  { source: 'sushi', target: 'chaobuzhi', type: 'student', label: '师生', description: '晁补之是苏门四学士之一' },
  { source: 'sushi', target: 'zhanglei', type: 'student', label: '师生', description: '张耒是苏门四学士之一' },
  { source: 'sushi', target: 'chenshiliang', type: 'student', label: '师生', description: '陈师道是苏门六君子之一' },
  
  // 朋友关系
  { source: 'sushi', target: 'fobizheng', type: 'friend', label: '挚友', description: '佛印与苏轼交往甚密' },
  { source: 'sushi', target: 'mifu', type: 'friend', label: '书友', description: '米芾与苏轼同为宋四家' },
  { source: 'sushi', target: 'liqingzhao', type: 'friend', label: '文友', description: '李清照深受苏轼影响' },
  
  // 同僚关系
  { source: 'sushi', target: 'simaguang', type: 'colleague', label: '同僚', description: '司马光与苏轼同属保守派' },
  { source: 'sushi', target: 'caixiang', type: 'colleague', label: '同僚', description: '蔡襄与苏轼同为宋四家' },
  { source: 'sushi', target: 'liuzongyuan', type: 'colleague', label: '同门', description: '曾巩与苏轼同为欧阳修门生' },
  
  // 政治对手
  { source: 'sushi', target: 'wanganshi', type: 'political', label: '政敌', description: '王安石与苏轼政见不同' },
  { source: 'sushi', target: 'zhangdun', type: 'political', label: '政敌', description: '章惇后来成为苏轼的政敌' },
  
  // 其他关系
  { source: 'huangtingjian', target: 'qinguan', type: 'friend', label: '同门', description: '同为苏门四学士' },
  { source: 'huangtingjian', target: 'chaobuzhi', type: 'friend', label: '同门', description: '同为苏门四学士' },
  { source: 'huangtingjian', target: 'zhanglei', type: 'friend', label: '同门', description: '同为苏门四学士' },
  { source: 'qinguan', target: 'chaobuzhi', type: 'friend', label: '同门', description: '同为苏门四学士' },
  { source: 'qinguan', target: 'zhanglei', type: 'friend', label: '同门', description: '同为苏门四学士' },
  { source: 'chaobuzhi', target: 'zhanglei', type: 'friend', label: '同门', description: '同为苏门四学士' },
  { source: 'suxun', target: 'suzhe', type: 'family', label: '父子', description: '苏洵是苏辙的父亲' },
  { source: 'ouyangxiu', target: 'liuzongyuan', type: 'mentor', label: '师生', description: '曾巩是欧阳修的学生' },
  { source: 'wanganshi', target: 'simaguang', type: 'political', label: '政敌', description: '新旧党争的对立双方' }
]

// 时间线事件
export const timelineEvents = [
  { year: 1037, title: '出生', description: '苏轼出生于眉州眉山（今四川眉山）', type: 'birth' },
  { year: 1054, title: '娶妻王弗', description: '与王弗成婚，时年十八岁', type: 'family' },
  { year: 1057, title: '进士及第', description: '与弟苏辙同登进士第，欧阳修为主考官', type: 'career' },
  { year: 1061, title: '制科入第', description: '参加制科考试，入第三等（宋代最高等）', type: 'career' },
  { year: 1065, title: '王弗去世', description: '原配妻子王弗病逝，年仅二十七岁', type: 'family' },
  { year: 1066, title: '父亲去世', description: '父亲苏洵去世，苏轼丁忧守孝', type: 'family' },
  { year: 1068, title: '续娶王闰之', description: '娶王弗堂妹王闰之为继室', type: 'family' },
  { year: 1071, title: '任杭州通判', description: '因反对王安石变法，自请外任杭州', type: 'career' },
  { year: 1074, title: '任密州知州', description: '调任密州（今山东诸城）知州', type: 'career' },
  { year: 1076, title: '水调歌头', description: '中秋夜作《水调歌头·明月几时有》', type: 'literature' },
  { year: 1079, title: '乌台诗案', description: '因诗文获罪入狱，险遭杀身之祸', type: 'political' },
  { year: 1080, title: '贬谪黄州', description: '被贬为黄州团练副使，开始"东坡"生涯', type: 'political' },
  { year: 1082, title: '赤壁赋', description: '作《前赤壁赋》《后赤壁赋》《念奴娇·赤壁怀古》', type: 'literature' },
  { year: 1085, title: '起复', description: '神宗去世，哲宗即位，苏轼被召回朝', type: 'career' },
  { year: 1089, title: '任杭州知州', description: '出任杭州知州，疏浚西湖，筑苏堤', type: 'career' },
  { year: 1093, title: '王闰之去世', description: '继室王闰之病逝', type: 'family' },
  { year: 1094, title: '再贬惠州', description: '新党执政，苏轼被贬惠州', type: 'political' },
  { year: 1096, title: '朝云去世', description: '侍妾王朝云病逝于惠州', type: 'family' },
  { year: 1097, title: '远贬儋州', description: '被贬至海南儋州，为宋代流放最远之地', type: 'political' },
  { year: 1100, title: '北归', description: '徽宗即位，大赦天下，苏轼北归', type: 'career' },
  { year: 1101, title: '去世', description: '病逝于常州，享年六十五岁', type: 'death' }
]
