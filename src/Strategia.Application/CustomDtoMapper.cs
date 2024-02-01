using Strategia.Courses.Dtos;
using Strategia.Courses;
using Strategia.UserProfiles.Dtos;
using Strategia.UserProfiles;
using Abp.Application.Editions;
using Abp.Application.Features;
using Abp.Auditing;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.DynamicEntityProperties;
using Abp.EntityHistory;
using Abp.Extensions;
using Abp.Localization;
using Abp.Notifications;
using Abp.Organizations;
using Abp.UI.Inputs;
using Abp.Webhooks;
using AutoMapper;
using Strategia.Auditing.Dto;
using Strategia.Authorization.Accounts.Dto;
using Strategia.Authorization.Delegation;
using Strategia.Authorization.Permissions.Dto;
using Strategia.Authorization.Roles;
using Strategia.Authorization.Roles.Dto;
using Strategia.Authorization.Users;
using Strategia.Authorization.Users.Delegation.Dto;
using Strategia.Authorization.Users.Dto;
using Strategia.Authorization.Users.Importing.Dto;
using Strategia.Authorization.Users.Profile.Dto;
using Strategia.Chat;
using Strategia.Chat.Dto;
using Strategia.DynamicEntityProperties.Dto;
using Strategia.Editions;
using Strategia.Editions.Dto;
using Strategia.Friendships;
using Strategia.Friendships.Cache;
using Strategia.Friendships.Dto;
using Strategia.Localization.Dto;
using Strategia.MultiTenancy;
using Strategia.MultiTenancy.Dto;
using Strategia.MultiTenancy.HostDashboard.Dto;
using Strategia.MultiTenancy.Payments;
using Strategia.MultiTenancy.Payments.Dto;
using Strategia.Notifications.Dto;
using Strategia.Organizations.Dto;
using Strategia.Sessions.Dto;
using Strategia.WebHooks.Dto;
using Stripe;

namespace Strategia
{
    internal static class CustomDtoMapper
    {

        public static void CreateMappings(IMapperConfigurationExpression configuration)
        {
            configuration.CreateMap<CreateOrEditCourseUserDto, CourseUser>().ReverseMap();
            configuration.CreateMap<CourseUserDto, CourseUser>().ReverseMap();
            configuration.CreateMap<CreateOrEditCourseLessonActivityDto, CourseLessonActivity>().ReverseMap();
            configuration.CreateMap<CourseLessonActivityDto, CourseLessonActivity>().ReverseMap();
            configuration.CreateMap<CreateOrEditCourseLessonDto, CourseLesson>().ReverseMap();
            configuration.CreateMap<CourseLessonDto, CourseLesson>().ReverseMap();
            configuration.CreateMap<CreateOrEditCourseDto, Course>().ReverseMap();
            configuration.CreateMap<CourseDto, Course>().ReverseMap();

            configuration.CreateMap<UserProfile, CreateOrEditUserProfileDto>()
                .ForMember(dest => dest.ChatGPTRecommendation, opt => opt.MapFrom(src => src.ChatGPTRecommendation));
            configuration.CreateMap<string, ChatGPT.Dtos.GPTResponse>().ConvertUsing<JsonToParsedChatGPTResponseTypeConverter>();

            configuration.CreateMap<UserProfile, UserProfileDto>()
                .ForMember(dest => dest.ChatGPTRecommendation, opt => opt.MapFrom(src => src.ChatGPTRecommendation));
            configuration.CreateMap<string, ChatGPT.Dtos.GPTResponse>().ConvertUsing<JsonToParsedChatGPTResponseTypeConverter>();

            configuration.CreateMap<UserProfile, CreateOrEditUserProfileDto>()
                .ForMember(dest => dest.ParsedResume, opt => opt.MapFrom(src => src.ParsedResume));
            configuration.CreateMap<string, Sovren.Models.Resume.ParsedResume>().ConvertUsing<JsonToParsedResumeTypeConverter>();

            configuration.CreateMap<UserProfile, UserProfileDto>()
                .ForMember(dest => dest.ParsedResume, opt => opt.MapFrom(src => src.ParsedResume));
            configuration.CreateMap<string, Sovren.Models.Resume.ParsedResume>().ConvertUsing<JsonToParsedResumeTypeConverter>();

            configuration.CreateMap<CreateOrEditUserProfileDto, UserProfile>().ReverseMap();
            configuration.CreateMap<UserProfileDto, UserProfile>().ReverseMap();
            //Inputs
            configuration.CreateMap<CheckboxInputType, FeatureInputTypeDto>();
            configuration.CreateMap<SingleLineStringInputType, FeatureInputTypeDto>();
            configuration.CreateMap<ComboboxInputType, FeatureInputTypeDto>();
            configuration.CreateMap<IInputType, FeatureInputTypeDto>()
                .Include<CheckboxInputType, FeatureInputTypeDto>()
                .Include<SingleLineStringInputType, FeatureInputTypeDto>()
                .Include<ComboboxInputType, FeatureInputTypeDto>();
            configuration.CreateMap<StaticLocalizableComboboxItemSource, LocalizableComboboxItemSourceDto>();
            configuration.CreateMap<ILocalizableComboboxItemSource, LocalizableComboboxItemSourceDto>()
                .Include<StaticLocalizableComboboxItemSource, LocalizableComboboxItemSourceDto>();
            configuration.CreateMap<LocalizableComboboxItem, LocalizableComboboxItemDto>();
            configuration.CreateMap<ILocalizableComboboxItem, LocalizableComboboxItemDto>()
                .Include<LocalizableComboboxItem, LocalizableComboboxItemDto>();

            //Chat
            configuration.CreateMap<ChatMessage, ChatMessageDto>();
            configuration.CreateMap<ChatMessage, ChatMessageExportDto>();

            //Feature
            configuration.CreateMap<FlatFeatureSelectDto, Feature>().ReverseMap();
            configuration.CreateMap<Feature, FlatFeatureDto>();

            //Role
            configuration.CreateMap<RoleEditDto, Role>().ReverseMap();
            configuration.CreateMap<Role, RoleListDto>();
            configuration.CreateMap<UserRole, UserListRoleDto>();

            //Edition
            configuration.CreateMap<EditionEditDto, SubscribableEdition>().ReverseMap();
            configuration.CreateMap<EditionCreateDto, SubscribableEdition>();
            configuration.CreateMap<EditionSelectDto, SubscribableEdition>().ReverseMap();
            configuration.CreateMap<SubscribableEdition, EditionInfoDto>();

            configuration.CreateMap<Edition, EditionInfoDto>().Include<SubscribableEdition, EditionInfoDto>();

            configuration.CreateMap<SubscribableEdition, EditionListDto>();
            configuration.CreateMap<Edition, EditionEditDto>();
            configuration.CreateMap<Edition, SubscribableEdition>();
            configuration.CreateMap<Edition, EditionSelectDto>();

            //Payment
            configuration.CreateMap<SubscriptionPaymentDto, SubscriptionPayment>().ReverseMap();
            configuration.CreateMap<SubscriptionPaymentListDto, SubscriptionPayment>().ReverseMap();
            configuration.CreateMap<SubscriptionPayment, SubscriptionPaymentInfoDto>();

            //Permission
            configuration.CreateMap<Permission, FlatPermissionDto>();
            configuration.CreateMap<Permission, FlatPermissionWithLevelDto>();

            //Language
            configuration.CreateMap<ApplicationLanguage, ApplicationLanguageEditDto>();
            configuration.CreateMap<ApplicationLanguage, ApplicationLanguageListDto>();
            configuration.CreateMap<NotificationDefinition, NotificationSubscriptionWithDisplayNameDto>();
            configuration.CreateMap<ApplicationLanguage, ApplicationLanguageEditDto>()
                .ForMember(ldto => ldto.IsEnabled, options => options.MapFrom(l => !l.IsDisabled));

            //Tenant
            configuration.CreateMap<Tenant, RecentTenant>();
            configuration.CreateMap<Tenant, TenantLoginInfoDto>();
            configuration.CreateMap<Tenant, TenantListDto>();
            configuration.CreateMap<TenantEditDto, Tenant>().ReverseMap();
            configuration.CreateMap<CurrentTenantInfoDto, Tenant>().ReverseMap();

            //User
            configuration.CreateMap<User, UserEditDto>()
                .ForMember(dto => dto.Password, options => options.Ignore())
                .ReverseMap()
                .ForMember(user => user.Password, options => options.Ignore());
            configuration.CreateMap<User, UserLoginInfoDto>();
            configuration.CreateMap<User, UserListDto>();
            configuration.CreateMap<User, ChatUserDto>();
            configuration.CreateMap<User, OrganizationUnitUserListDto>();
            configuration.CreateMap<Role, OrganizationUnitRoleListDto>();
            configuration.CreateMap<CurrentUserProfileEditDto, User>().ReverseMap();
            configuration.CreateMap<UserLoginAttemptDto, UserLoginAttempt>().ReverseMap();
            configuration.CreateMap<ImportUserDto, User>();

            //AuditLog
            configuration.CreateMap<AuditLog, AuditLogListDto>();
            configuration.CreateMap<EntityChange, EntityChangeListDto>();
            configuration.CreateMap<EntityPropertyChange, EntityPropertyChangeDto>();

            //Friendship
            configuration.CreateMap<Friendship, FriendDto>();
            configuration.CreateMap<FriendCacheItem, FriendDto>();

            //OrganizationUnit
            configuration.CreateMap<OrganizationUnit, OrganizationUnitDto>();

            //Webhooks
            configuration.CreateMap<WebhookSubscription, GetAllSubscriptionsOutput>();
            configuration.CreateMap<WebhookSendAttempt, GetAllSendAttemptsOutput>()
                .ForMember(webhookSendAttemptListDto => webhookSendAttemptListDto.WebhookName,
                    options => options.MapFrom(l => l.WebhookEvent.WebhookName))
                .ForMember(webhookSendAttemptListDto => webhookSendAttemptListDto.Data,
                    options => options.MapFrom(l => l.WebhookEvent.Data));

            configuration.CreateMap<WebhookSendAttempt, GetAllSendAttemptsOfWebhookEventOutput>();

            configuration.CreateMap<DynamicProperty, DynamicPropertyDto>().ReverseMap();
            configuration.CreateMap<DynamicPropertyValue, DynamicPropertyValueDto>().ReverseMap();
            configuration.CreateMap<DynamicEntityProperty, DynamicEntityPropertyDto>()
                .ForMember(dto => dto.DynamicPropertyName,
                    options => options.MapFrom(entity => entity.DynamicProperty.DisplayName.IsNullOrEmpty() ? entity.DynamicProperty.PropertyName : entity.DynamicProperty.DisplayName));
            configuration.CreateMap<DynamicEntityPropertyDto, DynamicEntityProperty>();

            configuration.CreateMap<DynamicEntityPropertyValue, DynamicEntityPropertyValueDto>().ReverseMap();

            //User Delegations
            configuration.CreateMap<CreateUserDelegationDto, UserDelegation>();

            /* ADD YOUR OWN CUSTOM AUTOMAPPER MAPPINGS HERE */
        }
    }

    public class JsonToParsedResumeTypeConverter : ITypeConverter<string, Sovren.Models.Resume.ParsedResume>
    {
        public Sovren.Models.Resume.ParsedResume Convert(string source, Sovren.Models.Resume.ParsedResume destination, ResolutionContext context)
        {
            if (string.IsNullOrEmpty(source))
                return null;

            return Newtonsoft.Json.JsonConvert.DeserializeObject<Sovren.Models.Resume.ParsedResume>(source);
        }
    }

    public class JsonToParsedChatGPTResponseTypeConverter : ITypeConverter<string, ChatGPT.Dtos.GPTResponse>
    {
        public ChatGPT.Dtos.GPTResponse Convert(string source, ChatGPT.Dtos.GPTResponse destination, ResolutionContext context)
        {
            if (string.IsNullOrEmpty(source))
                return null;

            return Newtonsoft.Json.JsonConvert.DeserializeObject<ChatGPT.Dtos.GPTResponse>(source);
        }
    }

}