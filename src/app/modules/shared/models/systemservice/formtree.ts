
const Privilage_DATA: TreeNode[] = [
    {
      FormCaption: 'مديرية الشؤون الإدارية',
      FormName:'',
      TypeForm:2,
      id:0,
      children: [
        { 
          FormCaption: 'الذاتية',
          FormName:'',
           TypeForm:2 ,
           id:1,
           children:[
             {
              FormCaption: 'البطاقة الذاتية',
              FormName:'',
               TypeForm:2 ,
               id:2,
               children:[
                 {
                  FormCaption:'البيانات الشخصية',
                  FormName:'ManageEmployeeDataCardFrame1',
                  TypeForm:1,
                  id:3,
                 },
                 {
                  FormCaption:'المؤهل العلمي',
                  FormName:'ManageSCEducationFrame1',
                  TypeForm:1,
                  id:4,
                 },
  
               ]
             },
             { 
              FormCaption: 'الترفيعات والزيادات',
              FormName:'',
               TypeForm:2 ,
               id:5,
               children:[
                {                
                  FormCaption:'تجهيز ملف الترفيعات',
                  FormName:'UpgradePrepareAllFrame1',
                  TypeForm:1,
                  id:6,
                 },
                 {
                    FormCaption:'عرض بيانات الترفيعات',
                    FormName:'UpgradeViewDataFrame1',
                    TypeForm:1,                  
                    id:7,
                  },                       
                ]                    
              }
           ]
          
      },    
    ]
  
  }];
  