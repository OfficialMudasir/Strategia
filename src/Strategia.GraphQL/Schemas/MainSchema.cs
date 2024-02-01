using Abp.Dependency;
using GraphQL.Types;
using GraphQL.Utilities;
using Strategia.Queries.Container;
using System;

namespace Strategia.Schemas
{
    public class MainSchema : Schema, ITransientDependency
    {
        public MainSchema(IServiceProvider provider) :
            base(provider)
        {
            Query = provider.GetRequiredService<QueryContainer>();
        }
    }
}