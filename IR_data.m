clc;
close all;
clear;

%OPEN FILE
fname = 'results.json'; 
fid = fopen(fname); 
raw = fread(fid,inf); 
str = char(raw'); 
fclose(fid); 

%DATA EXTRACTION
user_studies = strsplit(str,"\n");
user_tasks = 8;

time_data = zeros(16,length(user_studies));
found_data = strings(16,length(user_studies));
pclick_data = zeros(16,length(user_studies));
pclick_data = pclick_data-1;
lclick_data = zeros(16,length(user_studies));
lclick_data = lclick_data-1;
feedback_data = zeros(3,length(user_studies));


for i=1:length(user_studies)
    data = user_studies{i};
    tasks = extractBetween(data,'{"task":"','","cat"');
    cat = extractBetween(data,',"cat":',',"found":');
    found = extractBetween(data,',"found":',',"time":');
    time = extractBetween(data,',"time":',',"lclicks":');
    lclick = extractBetween(data,',"lclicks":',',"pclicks":');
    pclick = extractBetween(data,',"pclicks":','}');
    fb1 = extractBetween(data,'"fb1":"','","');
    fb2 = extractBetween(data,'"fb2":"','","');
    fb3 = extractBetween(data,'"fb3":"','"}');
    
    
    for j=1:length(time)
        if(strcmpi(cat{j}, 'true'))
            time_data((j*2)-1,i) = str2double(time{j});
            found_data((j*2)-1,i) = found{j};
            if(strcmpi(found{j}, 'true'))
                pclick_data((j*2)-1,i) = str2double(pclick{j});
                lclick_data((j*2)-1,i) = str2double(lclick{j});
            end
        else
            time_data((j*2),i) = str2double(time{j});
            found_data((j*2),i) = found{j};
            if(strcmpi(found{j}, 'true'))
                pclick_data((j*2),i) = str2double(pclick{j});
                lclick_data((j*2),i) = str2double(lclick{j});
            end
        end 
    end
    
    feedback_data(1,i) = str2double(fb1);
    feedback_data(2,i) = str2double(fb2);
    feedback_data(3,i) = str2double(fb3);
    
    
    
end

%TIME PER TASK
time_data(time_data==0) = nan;
time_data(time_data==-1) = nan;

time_cat = [time_data(1,:)', time_data(3,:)', time_data(5,:)',time_data(7,:)', ...
    time_data(9,:)', time_data(11,:)', time_data(13,:)', time_data(15,:)'];
time_uncat = [time_data(2,:)', time_data(4,:)', time_data(6,:)',time_data(8,:)', ...
    time_data(10,:)', time_data(12,:)', time_data(14,:)', time_data(16,:)'];

figure;
position_O = 1:1:8;  
% Define position for 12 Month_O boxplots  
box_O = boxplot(time_cat,'colors','b','positions',position_O,'width',0.18); 
set(gca,'XTickLabel',{' '})  % Erase xlabels   
hold on  % Keep the Month_O boxplots on figure overlap the Month_S boxplots   
% Boxplot for the simulated temperature from January to December 
position_S = 1.3:1:8.3;  % Define position for 12 Month_S boxplots  
box_S = boxplot(time_uncat,'colors','r','positions',position_S,'width',0.18);   
hold off   % Insert texts and labels 
ylabel('Time (s)') 
text('Position',[1.1,0],'String','Jaguar') 
text('Position',[2.1,0],'String','Hertz') 
text('Position',[3.1,0],'String','Shell') 
text('Position',[4.1,0],'String','Apple') 
text('Position',[5.1,0],'String','Fish') 
text('Position',[6.1,0],'String','Mouse') 
text('Position',[7.1,0],'String','Bear') 
text('Position',[8.1,0],'String','Duck') 
set(gca,'XTickLabel',{''});   % To hide outliers 
out_O = box_O(end,~isnan(box_O(end,:)));  
delete(out_O)  
out_S = box_S(end,~isnan(box_S(end,:)));  
delete(out_S)



% TOTAL TIME
time_cat_total = time_cat(:);
time_uncat_total = time_uncat(:);

figure;
boxplot([time_cat_total,time_uncat_total], 'labels', {'Categorized', 'Uncategorized'}, 'colors', 'br');
ylabel('Time (s)')



%TTEST TIME
ttest_array = zeros(2,user_tasks);
for i=1:user_tasks
    temp_cat = time_data((i*2)-1,:);
    temp_uncat = time_data((i*2),:);
    [h_temp,p_temp] = ttest2(temp_cat(not(isnan(temp_cat))), temp_uncat(not(isnan(temp_uncat))));
    ttest_array(1,i) = h_temp;
    ttest_array(2,i) = p_temp;
end


%PERCENTAGE FOUND PER TASK
count_found = sum(found_data'=='true');
count_notfound = sum(found_data'=='false');
total_found = count_found+count_notfound;
perc_found = count_found./total_found;
cat_found = perc_found(1:2:end) ;
uncat_found = perc_found(2:2:end) ;
foundcount_data = [cat_found*100; uncat_found*100];

hold on;
figure;
h = bar(foundcount_data');
xlabel('Task');
ylabel('Percentage found');
legend(h,{'Categorized','Uncategorized'});
hold off;


%TOTAL FOUND CAT/UNCAT
count_total_found_cat = sum(count_found(1:2:end));
count_total_found_uncat = sum(count_found(2:2:end));
count_total_notfound_cat = sum(count_notfound(1:2:end));
count_total_notfound_uncat = sum(count_notfound(2:2:end));
total_found_cat = count_total_found_cat + count_total_notfound_cat;
total_found_uncat = count_total_found_uncat + count_total_notfound_uncat;
perc_found_cat = count_total_found_cat./total_found_cat
perc_found_uncat = count_total_found_uncat./total_found_uncat



%CLICK DATA
pclick_data(pclick_data==-1) = nan;
lclick_data(lclick_data==-1) = nan;
pclick_array = zeros(16,1);
lclick_array = zeros(16,1);
for i=1:16
    temp_p = pclick_data(i,:);
    temp_l = lclick_data(i,:);
    pclick_array(i) = sum(temp_p(not(isnan(temp_p))))/length(temp_p(not(isnan(temp_p))));
    lclick_array(i) = sum(temp_l(not(isnan(temp_l))))/length(temp_l(not(isnan(temp_l))));
    
end

pclick_cat = pclick_array(1:2:end);
pclick_uncat = pclick_array(2:2:end);
total_pclick = [pclick_cat,pclick_uncat];
lclick_cat = lclick_array(1:2:end);
lclick_uncat = lclick_array(2:2:end);
total_lclick = [lclick_cat,lclick_uncat];

total_pclick
total_lclick


%FEEDBACK
labels = {'Strongly disagree','Disagree', 'Neutral', 'Agree', 'Strongly agree'};
questions = {'Question 1', 'Question 2', 'Question 3'};
text = [''];

perc_fb = zeros(3,7)-1;

for i=1:7
    for j=1:3
    perc_fb(j,i) = (length(find(feedback_data(j,:)==i))/length(user_studies))*100;
    end
end

perc_fb_temp = zeros(3,5);
for i=1:3
    perc_fb_temp(i,1) = perc_fb(i,1);
    perc_fb_temp(i,2) = perc_fb(i,2) + perc_fb(i,3);
    perc_fb_temp(i,3) = perc_fb(i,4);
    perc_fb_temp(i,4) = perc_fb(i,5) + perc_fb(i,6);
    perc_fb_temp(i,5) = perc_fb(i,7);
end

likert(labels,questions,perc_fb_temp,text);




