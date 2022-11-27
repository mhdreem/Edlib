import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClearUpgradesFileComponent } from './components/clear-upgrades-file/clear-upgrades-file.component';
import { DisplayUpgradeDataComponent } from './components/display-upgrade-data/display-upgrade-data.component';
import { FixUpgradeYearListComponent } from './components/fix-Upgrade-Year/fix-upgrade-year-list/fix-upgrade-year-list.component';
import { IncreaseSalaryMarsoomComponent } from './components/increase-salary-marsoom/increase-salary-marsoom.component';
import { PrepareUpgradesFileComponent } from './components/prepare-upgrades-file/prepare-upgrades-file.component';
import { PrintReferralQararsComponent } from './components/print-referral-qarars/print-referral-qarars.component';
import { PrintUpgradeQararsComponent } from './components/print-upgrade-qarars/print-upgrade-qarars-list/print-upgrade-qarars.component';
import { RefreshAccounterMalakComponent } from './components/refresh-accounter-malak/refresh-accounter-malak.component';
import { RefreshEmployeeCartComponent } from './components/refresh-employee-cart/refresh-employee-cart.component';
import { RemainingOldQararsComponent } from './components/remaining-old-qarars/remaining-old-qarars.component';
import { ReplaceQararNumbersComponent } from './components/replace-qarar-numbers/replace-qarar-numbers.component';

import { UpgradePromotionQararsComponent } from './components/upgrade-promotion-qarars/upgrade-promotion-qarars.component';
import { UpgradeComponent } from './upgrade.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'upgrades',
    pathMatch: 'full'
  },


        {
          path: 'upgrades',
          component: UpgradeComponent,
          data:
          {
            title: 'ترفيعات العاملين'
          },
          children:
            [
              

              {
                path: 'printReferralQarar', component: PrintReferralQararsComponent, data:
                {
                  title: 'طباعة إحالات القرار'
                }
              },

              {
                path: 'RefreshEmployeeCart', component: RefreshEmployeeCartComponent, data:
                {
                  title: 'تحديث البطاقة الذاتية'
                }
              },

              {
                path: 'IncreaseSalaryMarsoom', component: IncreaseSalaryMarsoomComponent, data:
                {
                  title: 'مراسيم زيادة الرواتب'
                }
              },

              {
                path: 'printUpgradeQarars', component: PrintUpgradeQararsComponent, data:
                {
                  title: 'طباعة قرارات الترفيع'
                }
              },

              {
                path: 'replaceQararNumbers', component: ReplaceQararNumbersComponent, data:
                {
                  title: 'استبدال أرقام القرار'
                }
              },

              {
                path: 'upgradePromotionQarars', component: UpgradePromotionQararsComponent, data:
                {
                  title: 'تهيئة قرارات الترفيع'
                }
              },

              {
                path: 'prepareUpgradesFile', component: PrepareUpgradesFileComponent, data:
                {
                  title: 'تجهيز ملف الترفيعات'
                }
              },

              {
                path: 'refreshAccounterMalak', component: RefreshAccounterMalakComponent, data:
                {
                  title: 'تحديث ملاك المعتمد'
                }
              },

              {
                path: 'clearUpgradesFile', component: ClearUpgradesFileComponent, data:
                {
                  title: 'مسح ملف الترفيعات'
                }
              },

              {
                path: 'FixUpgradeYearList', component: FixUpgradeYearListComponent, data:
                {
                  title: 'تثبيت دورة الترفيع'
                }
              },

              {
                path: 'RemainingOldQarars', component: RemainingOldQararsComponent, data:
                {
                  title: 'القرارات الوهمية المتبقة'
                }
              },

              {
                path: 'DisplayUpgradeData', component: DisplayUpgradeDataComponent, data:
                {
                  title: 'عرض بيانات الترفيع'
                }
              },
              
              
            ]
        }
     




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpgradeRoutingModule { }
