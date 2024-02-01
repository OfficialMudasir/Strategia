using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Strategia.MultiTenancy.HostDashboard.Dto;

namespace Strategia.MultiTenancy.HostDashboard
{
    public interface IIncomeStatisticsService
    {
        Task<List<IncomeStastistic>> GetIncomeStatisticsData(DateTime startDate, DateTime endDate,
            ChartDateInterval dateInterval);
    }
}