/**
 * @description 页面操作权限判断条件-组合式函数
 * @author changz
 * */

import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
export default function getPermisson() {
  const store = useStore()
  const state = reactive({
    unit_per: false,
    unit_member_per: false,
    team_per: false,
    team_member_per: false,
    role_per: false,
    role_member_per: false,
    program_per: false,
    program_purchase_per: false,
    contract_per: false,
    propayment_make_per: false,
    propayment_collect_per: false,
    proimplement_start_per: false,
    proimplement_per: false,
    person_objective_per: false,
    keep_revenue_per: false,
    precollected_per: false,
    amortization_per: false,
    pay_apply_per: false,
    reimbursement_per: false,
    other_expense_per: false,
    financial_ex_per: false,
    receivable_per: false,
    loan_payable_per: false,
    project_cost_per: false
  })
  // 获取操作权限列表
  const operate_perm = store.state.operate_perm

  const allPermList = [
    'unit_per',
    'unit_member_per',
    'team_per',
    'team_member_per',
    'role_per',
    'role_member_per',
    'program_per', // 信息修改
    'program_purchase_per', // 采购管理
    'contract_per', // 合同修改
    'propayment_make_per', // 开票管理
    'propayment_collect_per', // 收票管理
    'proimplement_start_per', // 项目启动
    'proimplement_per', // 项目实施
    'person_objective_per', // 个人目标
    'keep_revenue_per', // 保存收入信息
    'precollected_per', // 预收管理
    'amortization_per', // 提成核算
    'pay_apply_per', // 付款申请
    'reimbursement_per', // 报销申请
    'other_expense_per', // 删除费用
    'financial_ex_per', // 财务管理
    'receivable_per', // 应收管理
    'loan_payable_per', // 应付借款
    'project_cost_per' // 项目费用
  ]

  allPermList.forEach(item => {
    if (operate_perm.includes(item)) state[item] = true
  })

  return {
    ...toRefs(state)
  }
}