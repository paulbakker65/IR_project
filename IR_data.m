clc;
close all;
clear;

fname = 'results.json'; 
fid = fopen(fname); 
raw = fread(fid,inf); 
str = char(raw'); 
fclose(fid); 


user_studies = strsplit(str,"\n");

time_data = zeros(16,length(user_studies));
found_data = strings(16,length(user_studies));


for i=1:length(user_studies)
    data = user_studies{i};
    tasks = extractBetween(data,'{"task":"','","cat"');
    cat = extractBetween(data,',"cat":',',"found":');
    found = extractBetween(data,',"found":',',"time":');
    time = extractBetween(data,',"time":',',"lclicks":');
    lclick = extractBetween(data,',"lclicks":',',"pclicks":');
    pclick = extractBetween(data,',"pclicks":','},{"task"');
    
    for j=1:length(time)
        if(strcmpi(cat{j}, 'true'))
            time_data((j*2)-1,i) = str2double(time{j});
            found_data((j*2)-1,i) = found{j};
        else
            time_data((j*2),i) = str2double(time{j});
            found_data((j*2),i) = found{j};
        end
    end
    
    
    
end

labels = {'Jaguar',' ','Hertz',' ','Shell',' ','Apple',' ','Fish',' ','Mouse',' ','Bear',' ','Duck',' '};

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

count_found = sum(found_data'=='true');
count_notfound = sum(found_data'=='false');
total_found = count_found+count_notfound;
perc_found = count_found./total_found;
cat_found = perc_found(1:2:end) ;
uncat_found = perc_found(2:2:end) ;
foundcount_data = [cat_found*100; uncat_found*100];

hold on;
c = categorical(labels');
figure;
h = bar(foundcount_data');
xlabel('Task');
ylabel('Percentage correct');
legend(h,{'Categorized','Uncategorized'});
hold off;



